const express = require("express");
const port = process.env.PORT || "3444";
const odbc = require("odbc");

app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log("Server listening at http://localhost:" + port);
});

let db;

odbc.connect(
  "DRIVER={PostgreSQL UNICODE};SERVER=localhost;UID=postgres;PWD=1324123a;DATABASE=servisim",
  (error, connection) => {
    if (error) {
      console.log(error);
    } else {
      db = connection;
    }
  }
);

//param: pid,password,sid
app.get("/checkCredentials", (req, res) => {
  const pid = req.query.pid;
  console.log(pid);
  db.query(
    'SELECT * FROM servisim."CREDENTIAL" WHERE "Pid" = ' +
      pid +
      'AND "Sid" = ' +
      req.query.sid,
    (err, resQ) => {
      if (!err) {
        if (resQ.length == 0) {
          res.send("0");
        } else {
          const credential = resQ[0];
          console.log(credential);
          if (credential.Password == req.query.password) {
            if (credential.Type == true) {
              res.send("1");
            } else if (credential.Type == false) {
              res.send("2");
            }
          } else {
            console.log(credential.Password, req.query.password);
            res.send("3");
          }
        }
      } else {
        res.send(err.message);
      }
    }
  );
});

app.post("/deleteUser", (req, res) => {
  const pid = req.body.pid;
  const sid = req.body.sid;
  db.query(
    'DELETE FROM servisim."PERSON" WHERE "Pid" = ' + pid + 'AND "Sid" = ' + sid,
    (err, resQ) => {
      if (!err) {
        res.send({ res: "ok" });
      } else {
        res.send(err);
      }
    }
  );
});
//http://localhost:3044/getUsers?pid=181101020&sid=1
app.get("/getUsers", (req, res) => {
  const pid = req.query.pid;
  const sid = req.query.sid;
  console.log(pid);
  if (!pid && !sid) {
    db.query(
      'SELECT y."Pid" ,y."Sid", x."Fname", x."Minit", x."Lname", y."RequestedNotificationSpan", y."Address" FROM servisim."PERSON" AS x INNER JOIN servisim."USER" AS y ON x."Pid" = y."Pid" AND x."Sid" = y."Sid"',
      (err, resQ) => {
        if (!err) {
          const sliced = resQ.slice(0, resQ.length);
          res.send(sliced);
        } else {
          res.send(err);
        }
      }
    );
  } else {
    db.query(
      'SELECT y."Pid" ,y."Sid", x."Fname", x."Minit", x."Lname", y."RequestedNotificationSpan", y."Address" FROM servisim."PERSON" AS x INNER JOIN servisim."USER" AS y ON x."Pid" = y."Pid" AND x."Sid" = y."Sid" WHERE  y."Pid" = ' +
        pid +
        'AND y."Sid" = ' +
        sid,
      (err, resQ) => {
        if (!err) {
          const sliced = resQ.slice(0, resQ.length);
          res.send(sliced);
        } else {
          res.send(err);
        }
      }
    );
  }
});

//http://localhost:3044/getSchools?sid=2
app.get("/getSchools", (req, res) => {
  const sid = req.query.sid;
  if (!sid) {
    db.query('SELECT * FROM servisim."SCHOOL"', (err, resQ) => {
      if (!err) {
        const sliced = resQ.slice(0, resQ.length);
        res.send(sliced);
      } else {
        res.send(err);
      }
      db.end;
    });
  } else {
    db.query(
      'SELECT * FROM servisim."SCHOOL" WHERE  "Sid" = ' + sid,
      (err, resQ) => {
        if (!err) {
          const sliced = resQ.slice(0, resQ.length);
          res.send(sliced);
        } else {
          res.send(err);
        }
      }
    );
  }
});

app.post("/addUser", (req, res) => {
  const info = req.body;
  console.log(info);

  db.query(
    'SELECT * FROM servisim."CREDENTIAL" WHERE "Pid" =' +
      info.pid +
      'AND "Sid" =' +
      info.sid,
    (err, resQ) => {
      if (!err) {
        if (resQ.length != 0) {
          res.send("Bu id ile kullanici zaten var");
        } else {
          const name = info.name.split(" ");
          let fname = "";
          let lname = "";
          let minit = "-";
          fname = name[0];
          lname = name[name.length - 1];
          if (name.length > 2) {
            minit = name[1][0];
          }
          db.query(
            'INSERT INTO servisim."PERSON"("Pid", "Fname", "Minit", "Lname", "Sid") VALUES (' +
              info.pid +
              ",'" +
              fname +
              "','" +
              minit +
              "','" +
              lname +
              "'," +
              info.sid +
              ")",
            (err, resQ) => {
              if (!err) {
                if (info.type == "1") {
                  db.query(
                    'INSERT INTO servisim."CREDENTIAL"("Pid", "Type", "Password", "Sid")VALUES (' +
                      info.pid +
                      ",'true','" +
                      info.password +
                      "'," +
                      info.sid +
                      ")",
                    (err, resQ) => {
                      if (!err) {
                        db.query(
                          'INSERT INTO servisim."ADMIN"("Pid", "Sid")VALUES (' +
                            info.pid +
                            "," +
                            info.sid +
                            ")",
                          (err, resQ) => {
                            if (err) {
                              res.send(err);
                            } else {
                              res.send({ res: "ok" });
                            }
                          }
                        );
                      } else {
                        res.send(err);
                      }
                    }
                  );
                } else if (info.type == "0") {
                  db.query(
                    'INSERT INTO servisim."CREDENTIAL"("Pid", "Type", "Password", "Sid")VALUES (' +
                      info.pid +
                      ",'false','" +
                      info.password +
                      "'," +
                      info.sid +
                      ")",
                    (err, resQ) => {
                      if (!err) {
                        console.log(info.address, info.sid);
                        db.query(
                          'INSERT INTO servisim."USER"("Pid", "Address", "RequestedNotificationSpan", "Sid")VALUES (' +
                            info.pid +
                            ",'" +
                            info.address +
                            "', 30," +
                            info.sid +
                            ")",
                          (err, resQ) => {
                            if (err) {
                              res.send(err);
                            } else {
                              res.send({ res: "ok" });
                            }
                          }
                        );
                      } else {
                        res.send(err);
                      }
                    }
                  );
                }
              } else {
                res.send(err);
              }
            }
          );
        }
      } else {
        res.send(err);
      }
    }
  );
});

//ogrenci kaydolurken servis binecegi yeri sececek
//param:sid
app.get("/getPlacesBySid", (req, res) => {
  const sid = req.query.sid;
  let sname = "";

  console.log(sid);
  db.query(
    'SELECT "Sname" FROM servisim."SCHOOL"  WHERE "Sid" = ' + sid,
    (err, resQ) => {
      if (!err) {
        sname = resQ[0].Sname;
        db.query(
          'SELECT "PlaceID"   FROM  servisim."PLACE"  WHERE "PlaceName" = ' +
            "'" +
            sname +
            "'",
          (err, resQ) => {
            if (!err) {
              if (resQ.length == 0) {
                return res.send([]);
              }
              db.query(
                'SELECT foo."PlaceID", foo."PlaceName" FROM servisim."PLACE" AS foo INNER JOIN (SELECT DISTINCT x."From" FROM servisim."TRANSPORT" AS x WHERE x."Sid" =' +
                  sid +
                  'AND x."To" = ' +
                  resQ[0].PlaceID +
                  ') AS y ON y."From" = foo."PlaceID"',
                (err, resQ) => {
                  if (!err) {
                    const sliced = resQ.slice(0, resQ.length);
                    console.log(sliced);
                    res.send(sliced);
                  } else {
                    res.send(err);
                  }
                }
              );
            } else {
              res.send(err);
            }
          }
        );
      } else {
        res.send(err);
      }
    }
  );
});

//okul olmayan sisteme kayitli her yer
app.get("/getPlaces", (req, res) => {
  console.log("getPlaces");
  db.query(
    'SELECT "PlaceID", "PlaceName" FROM servisim."PLACE" WHERE "isSchool" =' +
      "'false'",
    (err, resQ) => {
      if (!err) {
        const sliced = resQ.slice(0, resQ.length);
        res.send(sliced);
      } else {
        res.send(err);
      }
    }
  );
});

app.get("/getPlacesBySidWSchool", (req, res) => {
  const sid = req.query.sid;
  let sname = "";
  console.log("getPlacesBySidWSchool", sid);
  db.query(
    'SELECT "Sname" FROM servisim."SCHOOL"  WHERE "Sid" = ' + sid,
    (err, resQ) => {
      if (!err) {
        sname = resQ[0].Sname;
        db.query(
          'SELECT "PlaceID" FROM  servisim."PLACE"  WHERE "PlaceName" = ' +
            "'" +
            sname +
            "'",
          (err, resQ) => {
            if (!err) {
              if (resQ.length == 0) {
                return res.send([]);
              }
              db.query(
                'SELECT * FROM servisim."PLACE" WHERE "isSchool" =' +
                  "'false' OR" +
                  ' "PlaceID" = ' +
                  resQ[0].PlaceID,
                (err, resQ) => {
                  if (!err) {
                    const sliced = resQ.slice(0, resQ.length);
                    console.log(sliced);
                    res.send(sliced);
                  } else {
                    res.send(err);
                  }
                }
              );
            } else {
              res.send(err);
            }
          }
        );
      } else {
        res.send(err);
      }
    }
  );
});

//from: ogrencinin sectigi adres to:  okulu
//param: pid,sid
app.get("/getTransportsByPidSid", (req, res) => {
  const pid = req.query.pid;
  const sid = req.query.sid;
  console.log("getTransportsByPidSid", pid, sid);
  let addressID;

  db.query(
    'SELECT * FROM servisim."USER" WHERE "Pid" = ' + pid + 'AND "Sid" = ' + sid,
    (err, resQ) => {
      if (!err) {
        addressID = resQ[0].Address;
        db.query(
          'SELECT "Sname" FROM servisim."SCHOOL" WHERE "Sid" = ' + sid,
          (err, resQ) => {
            if (!err) {
              console.log(addressID, resQ[0].Sname);
              db.query(
                'SELECT "PlaceID" FROM servisim."PLACE" WHERE "PlaceName" = ' +
                  "'" +
                  resQ[0].Sname +
                  "'",
                (err, resQ) => {
                  if (!err) {
                    let sPlaceID = resQ[0].PlaceID;
                    db.query(
                      'SELECT "Plate", "Time", "PhoneNumber" FROM servisim."TRANSPORT"  WHERE "From" = ' +
                        addressID +
                        ' AND "To" = ' +
                        sPlaceID,
                      (err, resQ) => {
                        if (!err) {
                          const sliced = resQ.slice(0, resQ.length);
                          res.send(sliced);
                        } else {
                          res.send(err);
                        }
                      }
                    );
                  } else {
                    res.send(err);
                  }
                }
              );
            } else {
              res.send(err);
            }
          }
        );
      } else {
        res.send(err);
      }
    }
  );
});

app.get("/getTransportsFromSchool", (req, res) => {
  const sid = req.query.sid;
  const placeID = req.query.placeID;

  db.query(
    'SELECT "Sname" FROM servisim."SCHOOL"  WHERE "Sid" = ' + sid,
    (err, resQ) => {
      if (!err) {
        const sname = resQ[0].Sname;
        db.query(
          'SELECT "PlaceID" FROM servisim."PLACE"  WHERE "PlaceName" = ' +
            "'" +
            sname +
            "'",
          (err, resQ) => {
            if (!err) {
              db.query(
                'SELECT foo1."PhoneNumber", foo1."Plate", foo1."Time", foo1."Sid", foo1."Tid", foo1."From", foo2."PlaceName" AS "To", foo1."FromID", foo1."To" AS "ToID" FROM (SELECT x."PhoneNumber", x."Plate", x."Time", x."To", x."Sid", x."Tid", y."PlaceName" AS "From", x."From"  AS "FromID" FROM servisim."TRANSPORT" AS x INNER JOIN servisim."PLACE" AS y ON x."From" = y."PlaceID") AS foo1 INNER JOIN servisim."PLACE" AS foo2 ON foo1."To" = foo2."PlaceID" WHERE foo1."FromID" = ' +
                  resQ[0].PlaceID +
                  'AND foo1."To" =' +
                  placeID +
                  'ORDER BY foo1."Time" ',
                (err, resQ) => {
                  if (!err) {
                    const sliced = resQ.slice(0, resQ.length);
                    res.send(sliced);
                  } else {
                    res.send(err);
                  }
                }
              );
            } else {
              res.send(err);
            }
          }
        );
      } else {
        res.send(err);
      }
    }
  );
});
app.get("/getTransportsToSchool", (req, res) => {
  const sid = req.query.sid;
  const placeID = req.query.placeID;

  db.query(
    'SELECT "Sname" FROM servisim."SCHOOL"  WHERE "Sid" = ' + sid,
    (err, resQ) => {
      if (!err) {
        const sname = resQ[0].Sname;
        db.query(
          'SELECT "PlaceID" FROM servisim."PLACE" WHERE "PlaceName" = ' +
            "'" +
            sname +
            "'",
          (err, resQ) => {
            if (!err) {
              db.query(
                'SELECT foo1."PhoneNumber", foo1."Plate", foo1."Time", foo1."Sid", foo1."Tid", foo1."From", foo2."PlaceName" AS "To", foo1."FromID", foo1."To" AS "ToID" FROM (SELECT x."PhoneNumber", x."Plate", x."Time", x."To", x."Sid", x."Tid", y."PlaceName" AS "From", x."From"  AS "FromID" FROM servisim."TRANSPORT" AS x INNER JOIN servisim."PLACE" AS y ON x."From" = y."PlaceID") AS foo1 INNER JOIN servisim."PLACE" AS foo2 ON foo1."To" = foo2."PlaceID" WHERE foo1."FromID" = ' +
                  placeID +
                  ' AND foo1."To" = ' +
                  resQ[0].PlaceID +
                  'ORDER BY foo1."Time" ',
                (err, resQ) => {
                  if (!err) {
                    const sliced = resQ.slice(0, resQ.length);
                    res.send(sliced);
                  } else {
                    res.send(err);
                  }
                }
              );
            } else {
              res.send(err);
            }
          }
        );
      } else {
        res.send(err);
      }
    }
  );
});

//bir okula ait tüm ulaşımları gösterir
//admin sayfasında da bu kullanilacak, admin bu listeden silme yapabilir
//param: sid
app.get("/getAllTransportsBySid", (req, res) => {
  const sid = req.query.sid;
  console.log("getAllTransportsBySid", sid);
  db.query(
    'SELECT foo1."PhoneNumber", foo1."Plate", foo1."Time", foo1."Sid", foo1."Tid", foo1."From", foo2."PlaceName" AS "To", foo1."FromID", foo1."To" AS "ToID" FROM (SELECT x."PhoneNumber", x."Plate", x."Time", x."To", x."Sid", x."Tid", y."PlaceName" AS "From", x."From" AS "FromID" FROM servisim."TRANSPORT" AS x INNER JOIN servisim."PLACE" AS y ON x."From" = y."PlaceID") AS foo1 INNER JOIN servisim."PLACE" AS foo2 ON foo1."To" = foo2."PlaceID" WHERE foo1."Sid" =' +
      sid +
      " ORDER BY foo1." +
      '"Time"',
    (err, resQ) => {
      if (!err) {
        const sliced = resQ.slice(0, resQ.length);
        res.send(sliced);
      } else {
        res.send(err.message);
      }
    }
  );
});

//pid, day: number 0-6, hour, minutes, lname:lessonname
app.post("/addClass", (req, res) => {
  const info = req.body;
  console.log(info, "info");
  db.query(
    'INSERT INTO servisim."CURRICULUM"("Pid", "DayOfWeek", "Time", "Lname", "Sid")VALUES (' +
      info.pid +
      "," +
      info.day +
      ",'" +
      info.hour +
      ":" +
      info.minutes +
      "', '" +
      info.lname +
      "'," +
      info.sid +
      ")",
    (err, resQ) => {
      if (!err) {
        res.send({ res: "ok" });
      } else {
        res.send(err);
      }
    }
  );
});

//param: lid- lesson id
app.post("/deleteClass", (req, res) => {
  db.query(
    'DELETE FROM servisim."CURRICULUM" AS x WHERE x."Lid" =' + req.query.lid,
    (err, resQ) => {
      if (!err) {
        res.send({ res: "ok" });
      } else {
        res.send(err);
      }
    }
  );
});

//lid, day, hour, minutes, lname
app.post("/updateClass", (req, res) => {
  const info = req.body;
  if (info.lname && info.day && info.hour && info.minutes) {
    db.query(
      'UPDATE servisim."CURRICULUM" SET "DayOfWeek" = ' +
        info.day +
        ', "Time" = ' +
        "'" +
        info.hour +
        ":" +
        info.minutes +
        "'" +
        ', "Lname" = ' +
        "'" +
        info.lname +
        "'" +
        ' WHERE "Lid" = ' +
        info.lid,
      (err, resQ) => {
        if (!err) {
          res.send({ res: "ok" });
        } else {
          res.send(err);
        }
      }
    );
  } else if (!info.lname && info.day && info.hour && info.minutes) {
    db.query(
      'UPDATE servisim."CURRICULUM" SET "DayOfWeek" = ' +
        info.day +
        ', "Time" = ' +
        "'" +
        info.hour +
        ":" +
        info.minutes +
        "'" +
        ' WHERE "Lid" = ' +
        info.lid,
      (err, resQ) => {
        if (!err) {
          res.send("ok");
        } else {
          res.send(err);
        }
      }
    );
  } else if (info.lname && !info.day && info.hour && info.minutes) {
    db.query(
      'UPDATE servisim."CURRICULUM" SET "Time" = ' +
        "'" +
        info.hour +
        ":" +
        info.minutes +
        "'" +
        ', "Lname" = ' +
        "'" +
        info.lname +
        "'" +
        ' WHERE "Lid" = ' +
        info.lid,
      (err, resQ) => {
        if (!err) {
          res.send("ok");
        } else {
          res.send(err);
        }
      }
    );
  } else if (info.lname && info.day && !info.hour && !info.minutes) {
    db.query(
      'UPDATE servisim."CURRICULUM" SET "DayOfWeek" = ' +
        info.day +
        ', "Lname" = ' +
        "'" +
        info.lname +
        "'" +
        ' WHERE "Lid" = ' +
        info.lid,
      (err, resQ) => {
        if (!err) {
          res.send("ok");
        } else {
          res.send(err);
        }
      }
    );
  } else if (!info.lname && !info.day && info.hour && info.minutes) {
    db.query(
      'UPDATE servisim."CURRICULUM" SET "Time" = ' +
        "'" +
        info.hour +
        ":" +
        info.minutes +
        "'" +
        ' WHERE "Lid" = ' +
        info.lid,
      (err, resQ) => {
        if (!err) {
          res.send("ok");
        } else {
          res.send(err);
        }
      }
    );
  } else if (!info.lname && info.day && !info.hour && !info.minutes) {
    db.query(
      'UPDATE servisim."CURRICULUM" SET "DayOfWeek" = ' +
        info.day +
        ' WHERE "Lid" = ' +
        info.lid,
      (err, resQ) => {
        if (!err) {
          res.send("ok");
        } else {
          res.send(err);
        }
      }
    );
  } else if (info.lname && !info.day && !info.hour && !info.minutes) {
    db.query(
      'UPDATE servisim."CURRICULUM" SET "Lname" = ' +
        "'" +
        info.lname +
        "'" +
        ' WHERE "Lid" = ' +
        info.lid,
      (err, resQ) => {
        if (!err) {
          res.send("ok");
        } else {
          res.send(err);
        }
      }
    );
  }
});

//param: pid, sid
app.get("/getClassesByPidSid", (req, res) => {
  const pid = req.query.pid;
  const sid = req.query.sid;
  db.query(
    'SELECT * FROM servisim."CURRICULUM" AS x WHERE x."Pid" = ' +
      pid +
      ' AND x."Sid" = ' +
      sid +
      ' ORDER BY x."DayOfWeek" ASC, x."Time" ASC',
    (err, resQ) => {
      if (!err) {
        const sliced = resQ.slice(0, resQ.length);
        res.send(sliced);
      } else {
        res.send(err);
      }
    }
  );
});

app.get("/getClassesByDay", (req, res) => {
  const info = req.query;
  console.log(info);

  db.query(
    'SELECT * FROM servisim."CURRICULUM" WHERE "DayOfWeek" = ' +
      info.day +
      ' AND "Pid" = ' +
      info.pid +
      ' AND "Sid" = ' +
      info.sid +
      'AND "Time" >' +
      "'" +
      info.time +
      "'" +
      'ORDER BY "Time"',
    (err, resQ) => {
      if (!err) {
        const sliced = resQ.slice(0, resQ.length);
        res.send(sliced);
      } else {
        res.send(err);
      }
    }
  );
});

//pid, ntf, sid
app.post("/updateNtfSpan", (req, res) => {
  const info = req.body;
  db.query(
    'UPDATE servisim."USER" SET "RequestedNotificationSpan" = ' +
      info.ntf +
      ' WHERE "Pid" = ' +
      info.pid +
      ' AND "Sid" = ' +
      info.sid,
    (err, resQ) => {
      if (!err) {
        res.send({ res: "ok" });
      } else {
        res.send(err);
      }
    }
  );
});

//pid, newAddress,sid
app.post("/updateAddress", (req, res) => {
  const info = req.body;
  console.log("updateAddress", info);
  db.query(
    'UPDATE servisim."USER"  SET "Address" = ' +
      info.newAddress +
      ' WHERE "Pid" = ' +
      info.pid +
      ' AND "Sid" = ' +
      info.sid,
    (err, resQ) => {
      if (!err) {
        res.send({ res: "ok" });
      } else {
        res.send(err);
      }
    }
  );
});

//pid, newPassword,sid
app.post("/updatePassword", (req, res) => {
  const info = req.body;
  db.query(
    'SELECT x."Password" FROM servisim."CREDENTIAL" AS x WHERE x."Pid" = ' +
      info.pid +
      ' AND x."Sid" = ' +
      info.sid,
    (err, resQ) => {
      if (!err) {
        if (resQ[0].Password == info.newPassword) {
          res.send({ res: "0" }); //aynı şifre
        } else {
          db.query(
            'UPDATE servisim."CREDENTIAL"  SET "Password" = ' +
              "'" +
              info.newPassword +
              "'" +
              ' WHERE "Pid" = ' +
              info.pid +
              ' AND "Sid" = ' +
              info.sid,
            (err, resQ) => {
              if (!err) {
                res.send({ res: "ok" });
              } else {
                res.send(err);
              }
            }
          );
        }
      } else {
        res.send(err);
      }
    }
  );
});

//ADMIN ISLEMLERI

//buradaki sid sectirilmeyecek, adminin kaydolurken sectigi sidyi alacak
app.post("/addTransport", (req, res) => {
  const info = req.body;
  db.query(
    'INSERT INTO servisim."TRANSPORT"( "Plate", "Time", "From", "To", "PhoneNumber", "Sid")VALUES (' +
      "'" +
      info.plate +
      "', '" +
      info.hour +
      ":" +
      info.minute +
      "'," +
      info.from +
      "," +
      info.to +
      "," +
      info.phone +
      "," +
      info.sid +
      ")",
    (err, resQ) => {
      if (!err) {
        res.send({ res: "ok" });
      } else {
        res.send(err);
      }
    }
  );
});

app.post("/deleteTransport", (req, res) => {
  db.query(
    'DELETE FROM servisim."TRANSPORT" AS x WHERE x."Tid" =' + req.query.tid,
    (err, resQ) => {
      if (!err) {
        res.send({ res: "ok" });
      } else {
        res.send(err);
      }
    }
  );
});

app.post("/addPlace", (req, res) => {
  const info = req.body;
  db.query(
    'SELECT * FROM servisim."PLACE" WHERE "PlaceName" = ' +
      "'" +
      info.placename +
      "'",
    (err, resQ) => {
      if (!err) {
        if (resQ.length == 0) {
          db.query(
            'INSERT INTO servisim."PLACE"( "PlaceName", "isSchool")VALUES (' +
              "'" +
              info.placename +
              "', 'false')",
            (err, resQ) => {
              if (!err) {
                res.send({ res: "ok" });
              } else {
                res.send(err);
              }
            }
          );
        } else {
          res.send("Boyle bir yer zaten bulunmakta");
        }
      } else {
        res.send(err);
      }
    }
  );
});

app.post("/addSchool", (req, res) => {
  const info = req.body;
  db.query(
    'INSERT INTO servisim."SCHOOL"("Sid", "Sname", "Address")VALUES (' +
      info.sid +
      ", '" +
      info.sname +
      "', '" +
      info.saddress +
      "')",
    (err, resQ) => {
      if (!err) {
        db.query(
          'INSERT INTO servisim."PLACE"("PlaceName", "isSchool")VALUES (' +
            "'" +
            info.sname +
            "', 'true')",
          (err, resQ) => {
            if (!err) {
              res.send({ res: "ok" });
            } else {
              res.send(err);
            }
          }
        );
      } else {
        res.send(err);
      }
    }
  );
});
