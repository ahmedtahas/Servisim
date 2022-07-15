const client = require("./db/db.js");
const express = require("express");
const port = process.env.PORT || "3444";

app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log("Server listening at http://localhost:" + port);
});

client.connect();

app.get("/checkCredentials", (req, res) => {
  const pid = req.query.pid;
  console.log(pid);
  client.query(
    'SELECT * FROM servisim."CREDENTIAL" AS x WHERE x."Pid" = ' + pid,
    (err, resQ) => {
      if (!err) {
        if (resQ.rows.length == 0) {
          res.send("0");
        } else {
          const credential = resQ.rows[0];
          console.log(credential);
          if (credential.Password == req.query.password) {
            console.log("doru");
            if (credential.Type == true) {
              console.log("dddd");
              res.send("1");
            } else if (credential.Type == false) {
              console.log("xxx");
              res.send("2");
            }
          } else {
            res.send("3");
          }
        }
      } else {
        res.send(err.message);
      }
    }
  );
});
//http://localhost:3044/getUsers?pid=181101020
app.get("/getUsers", (req, res) => {
  const pid = req.query.pid;
  console.log(pid);
  if (!pid) {
    client.query('SELECT * FROM servisim."USER"', (err, resQ) => {
      if (!err) {
        res.send(resQ.rows);
      } else {
        res.send(err.message);
      }
    });
  } else {
    client.query(
      'SELECT * FROM servisim."USER" WHERE  "Pid" = ' + pid,
      (err, resQ) => {
        if (!err) {
          res.send(resQ.rows);
        } else {
          res.send(err.message);
        }
      }
    );
  }
});

//http://localhost:3044/getSchools?sid=2
app.get("/getSchools", (req, res) => {
  const sid = req.query.sid;
  if (!sid) {
    client.query('SELECT * FROM servisim."SCHOOL"', (err, resQ) => {
      if (!err) {
        res.send(resQ.rows);
        console.log("geldi");
      } else {
        res.send(err.message);
      }
      client.end;
    });
  } else {
    client.query(
      'SELECT * FROM servisim."SCHOOL" WHERE  "Sid" = ' + sid,
      (err, resQ) => {
        if (!err) {
          res.send(resQ.rows);
        } else {
          res.send(err.message);
        }
      }
    );
  }
});

app.post("/addUser", (req, res) => {
  const info = req.body;
  console.log(info);
  const name = info.name.split(" ");
  let fname = "";
  let lname = "";
  let minit = "-";
  fname = name[0];
  lname = name[name.length - 1];
  if (name.length > 2) {
    minit = name[1][0];
  }
  console.log(fname, minit, lname);

  client.query(
    'INSERT INTO servisim."PERSON"("Pid", "Fname", "Minit", "Lname") VALUES (' +
      info.pid +
      ",'" +
      fname +
      "','" +
      minit +
      "','" +
      lname +
      "')",
    (err, resQ) => {
      if (!err) {
        console.log("BBBBB");
        if (info.type == "1") {
          client.query(
            'INSERT INTO servisim."CREDENTIAL"("Pid", "Type", "Password")VALUES (' +
              info.pid +
              ",'true','" +
              info.password +
              "')",
            (err, resQ) => {
              if (!err) {
                client.query(
                  'INSERT INTO servisim."ADMIN"("Pid")VALUES (' +
                    info.pid +
                    ")",
                  (err, resQ) => {
                    if (err) {
                      res.send(err.message);
                    } else {
                      res.send("ok");
                    }
                  }
                );
              } else {
                res.send(err.message);
              }
            }
          );
        } else if (info.type == "0") {
          console.log("kfmndkmfgfdmgd");
          client.query(
            'INSERT INTO servisim."CREDENTIAL"("Pid", "Type", "Password")VALUES (' +
              info.pid +
              ",'false','" +
              info.password +
              "')",
            (err, resQ) => {
              if (!err) {
                console.log(info.address, info.sid);
                client.query(
                  'INSERT INTO servisim."USER"("Pid", "Address", "RequestedNotificationSpan", "Sid")VALUES (' +
                    info.pid +
                    ",'" +
                    info.address +
                    "', 30," +
                    info.sid +
                    ")",
                  (err, resQ) => {
                    if (err) {
                      res.send(err.message);
                    } else {
                      res.send("ok");
                    }
                  }
                );
              } else {
                res.send(err.message);
              }
            }
          );
        }
      } else {
        res.send(err.message);
      }
    }
  );
});

app.post("/addSchool", (req, res) => {
  const info = req.body;
  client.query(
    'INSERT INTO servisim."SCHOOL"("Sid", "Sname", "Address")VALUES (' +
      info.sid +
      ", '" +
      info.sname +
      "', '" +
      info.saddress +
      "')",
    (err, resQ) => {
      if (!err) {
        client.query(
          'INSERT INTO servisim."PLACE"("PlaceName")VALUES (' +
            "'" +
            info.sname +
            "'",
          (err, resQ) => {
            if (!err) {
              res.send("ok");
            } else {
              res.send(err.message);
            }
          }
        );
      } else {
        res.send(err.message);
      }
    }
  );
});

app.post("/addPlace", (req, res) => {
  client.query(
    'INSERT INTO servisim."PLACE"("PlaceName")VALUES (' +
      "'" +
      req.body.pname +
      "'",
    (err, resQ) => {
      if (!err) {
        res.send("ok");
      } else {
        res.send(err.message);
      }
    }
  );
});

/*
INSERT INTO servisim."TRANSPORT"(
	"Plate", "Time", "From", "To", "PhoneNumber", "Sid")
	VALUES ('10DJ33', '12:00', 1, 2, 05645734);
*/
app.post("/addTransport", (req, res) => {
  const info = req.body;
  client.query(
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
        res.send("ok");
      } else {
        res.send(err.message);
      }
    }
  );
});

//ogrenci kaydolurken servis binecegi yeri sececek
app.get("/getPlacesBySid", (req, res) => {
  const sid = req.query.sid;
  let sname = "";
  client.query(
    'SELECT foo."Sname" FROM servisim."SCHOOL" AS foo WHERE foo."Sid" = ' + sid,
    (err, resQ) => {
      if (!err) {
        sname = resQ.rows[0].Sname;
        client.query(
          'SELECT foo."PlaceID"   FROM  servisim."PLACE" AS foo WHERE foo."PlaceName" = ' +
            "'" +
            sname +
            "'",
          (err, resQ) => {
            console.log(resQ.rows.length);
            if (!err) {
              if (resQ.rows.length == 0) {
                console.log("QQQQQQ");
                return res.send([]);
              }
              client.query(
                'SELECT foo."PlaceID", foo."PlaceName" FROM servisim."PLACE" AS foo INNER JOIN (SELECT DISTINCT x."From" FROM servisim."TRANSPORT" AS x WHERE x."Sid" =' +
                  sid +
                  'AND x."To" = ' +
                  resQ.rows[0].PlaceID +
                  ') AS y ON y."From" = foo."PlaceID"',
                (err, resQ) => {
                  if (!err) {
                    res.send(resQ.rows);
                  } else {
                    console.log("aaaa");
                    res.send(err.message);
                  }
                }
              );
            } else {
              res.send(err.message);
            }
          }
        );
      } else {
        res.send(err.message);
      }
    }
  );
});
//from: ogrencinin sectigi adres to:  okulu
app.get("/getTransportsByPid", (req, res) => {
  const pid = req.query.pid;
  let sid;
  let addressID;

  client.query(
    'SELECT * FROM servisim."USER" AS x WHERE x."Pid" = ' + pid,
    (err, resQ) => {
      if (!err) {
        sid = resQ.rows[0].Sid;
        addressID = resQ.rows[0].Address;
        client.query(
          'SELECT x."Sname" FROM servisim."SCHOOL" AS x WHERE x."Sid" = ' + sid,
          (err, resQ) => {
            if (!err) {
              console.log(addressID, resQ.rows[0].Sname);
              client.query(
                'SELECT x."PlaceID" FROM servisim."PLACE" AS x WHERE x."PlaceName" = ' +
                  "'" +
                  resQ.rows[0].Sname +
                  "'",
                (err, resQ) => {
                  if (!err) {
                    let sPlaceID = resQ.rows[0].PlaceID;
                    client.query(
                      'SELECT * FROM servisim."TRANSPORT" AS x WHERE x."From" = ' +
                        addressID +
                        ' AND x."To" = ' +
                        sPlaceID,
                      (err, resQ) => {
                        if (!err) {
                          res.send(resQ.rows);
                        } else {
                          res.send(err.message);
                        }
                      }
                    );
                  } else {
                    res.send(err.message);
                  }
                }
              );
            } else {
              res.send(err.message);
            }
          }
        );
      } else {
        res.send(err.message);
      }
    }
  );
});

app.post("/addClass", (req, res) => {
  const info = req.body;
  client.query(
    'INSERT INTO servisim."CURRICULUM"("Pid", "DayOfWeek", "Time", "Lname")VALUES (' +
      info.pid +
      "," +
      info.day +
      ",'" +
      info.hour +
      ":" +
      info.minutes +
      "', '" +
      info.lname +
      "')",
    (err, resQ) => {
      if (!err) {
        res.send("ok");
      } else {
        res.send(err.message);
      }
    }
  );
});

app.post("/deleteClass", (req, res) => {
  const info = req.body;
  client.query(
    'DELETE FROM servisim."CURRICULUM" AS x WHERE x."Pid" =' +
      info.pid +
      'AND x."DayOfWeek" = ' +
      info.day +
      'AND x."Time" = ' +
      "'" +
      info.hour +
      ":" +
      info.minutes +
      "'",
    (err, resQ) => {
      if (!err) {
        res.send("ok");
      } else {
        res.send(err.message);
      }
    }
  );
});
