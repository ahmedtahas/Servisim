import { React, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../config/colors";
import server from "../config/server";

function Upcoming(props) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [sid, setSid] = useState(null);
  const [pid, setPid] = useState(null);
  const [classes, setClasses] = useState([]);
  const [transports, setTransports] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [show, setShow] = useState(false);
  const [cTime, setCTime] = useState(null);
  const time = new Date().getHours() + ":" + new Date().getMinutes();
  const day = new Date().getDay();

  const showClasses = () => {
    return (
      <View style={styles.classes}>
        {classes.map((item) => {
          return (
            <TouchableOpacity
              style={styles.class}
              onPress={() => {
                setCTime(item.time);
              }}
            >
              <Text style={styles.classText}>
                {item.name + " @ "} {(item.time + "").substring(0, 5)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  const showTransports = () => {
    return (
      <View style={styles.transportsView}>
        {transports.map((item) => {
          if (item.time < cTime) {
            return (
              <TouchableOpacity
                style={styles.transport}
                onPress={() => {
                  alert(item.phone);
                }}
              >
                <Text style={styles.transportText}>
                  {item.plate + " @ "} {(item.time + "").substring(0, 5)}
                </Text>
              </TouchableOpacity>
            );
          }
        })}
      </View>
    );
  };

  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      }
      return "";
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (pid !== null && sid !== null) {
      fetch(
        "http://" +
          server.server +
          "/getClassesByDay?day=" +
          day +
          "&sid=" +
          sid +
          "&pid=" +
          pid +
          "&time=" +
          time
      )
        .then((response) => response.json())
        .then((json) => {
          handleClasses(json);
        })
        .catch((error) => {
          console.error(error);
        });
      fetch(
        "http://" +
          server.server +
          "/getTransportsByPidSid?sid=" +
          sid +
          "&pid=" +
          pid
      )
        .then((response) => response.json())
        .then((json) => {
          handleTransports(json);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [sid, pid]);

  const handleTransports = (json) => {
    let transport = [];
    json.forEach((element) => {
      transport.push({
        time: element.Time,
        plate: element.Plate,
        phone: element.PhoneNumber,
      });
    });
    setTransports(transport);
  };

  const handleClasses = (json) => {
    let classes = [];
    for (let i = 0; i < json.length; i++) {
      classes.push({
        name: json[i].Lname,
        time: json[i].Time,
        lid: json[i].Lid,
        transports: [],
      });
    }

    setClasses(classes);
  };

  useEffect(() => {
    getData("pid").then((value) => {
      setPid(value);
    });
    getData("sid").then((value) => {
      setSid(value);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>Upcoming Courses</Text>
      <ScrollView style={styles.scrollView}>{showClasses()}</ScrollView>
      <Text style={{ fontSize: 20 }}>Transports</Text>
      <ScrollView style={styles.scrollView}>{showTransports()}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.tertiary,
    flexDirection: "column",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.tertiary,
    flexDirection: "column",
    alignContent: "stretch",
    width: "100%",
  },
  classes: {
    flex: 1,
    backgroundColor: colors.tertiary,
    flexDirection: "column",
    alignContent: "stretch",
    alignItems: "center",
    width: "100%",
  },
  class: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignContent: "stretch",
    width: "95%",
    justifyContent: "center",
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  classText: {
    fontSize: 20,
    padding: 10,
  },
  transport: {
    backgroundColor: colors.secondary,
    flexDirection: "row",
    alignContent: "stretch",
    width: "100%",
    justifyContent: "center",
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  transportText: {
    fontSize: 20,
    padding: 10,
  },
  transportsView: {
    backgroundColor: colors.tertiary,
    flexDirection: "column",
    alignContent: "stretch",
    width: "100%",
    justifyContent: "center",
    padding: 10,
    marginTop: 10,
  },
});

export default Upcoming;
