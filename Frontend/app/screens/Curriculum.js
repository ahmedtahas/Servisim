import { React, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  TextInput,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../config/colors";
import server from "../config/server";

function Curriculum(props) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        console.log(value, "value");
        return value;
      }
      return "";
    } catch (e) {
      console.log(e);
    }
  };
  const [pid, setPid] = useState(null);
  const [sid, setSid] = useState(null);
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);
  const [course, setCourse] = useState("Course");
  const [adding, setAdding] = useState(true);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getData("pid").then((value) => {
      setPid(value);
    });
    getData("sid").then((value) => {
      setSid(value);
    });
  }, []);

  useEffect(() => {
    if (pid && sid) {
      fetch(
        "http://" +
          server.server +
          "/getClassesByPidSid?pid=" +
          pid +
          "&sid=" +
          sid,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((json) => {
          handleClasses(json);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [pid, sid]);

  const getClasses = () => {
    fetch(
      "http://" +
        server.server +
        "/getClassesByPidSid?pid=" +
        pid +
        "&sid=" +
        sid,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        handleClasses(json);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleClasses = (json) => {
    let classes = [];
    json.map((classs) => {
      classes.push({
        label: classs.Lname,
        value: { time: classs.Time, day: classs.DayOfWeek },
        key: classs.Lid,
      });
    });
    setCourses(classes);
  };

  const handleDay = (day) => {
    setDay(day);
  };
  const handleHour = (hour) => {
    setHour(hour);
  };
  const handleMinute = (minute) => {
    setMinute(minute);
  };
  const handleCourse = (course) => {
    setCourse(course);
  };

  const handleAdd = () => {
    console.log(sid, pid, day, hour, minute, course);
    setAdding(true);
    fetch("http://" + server.server + "/addClass", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pid: pid,
        sid: sid,
        day: day,
        hour: hour,
        minutes: minute,
        lname: course,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        alert("successfully added");
        getClasses();
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <View style={styles.container}>
      {adding ? (
        <View style={styles.topContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setAdding(false);
            }}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Course"
            onChangeText={handleCourse}
          />
          <Picker
            style={styles.dayPicker}
            selectedValue={day}
            onValueChange={handleDay}
          >
            <Picker.Item label="Monday" value="1" />
            <Picker.Item label="Tuesday" value="2" />
            <Picker.Item label="Wednesday" value="3" />
            <Picker.Item label="Thursday" value="4" />
            <Picker.Item label="Friday" value="5" />
            <Picker.Item label="Saturday" value="6" />
            <Picker.Item label="Sunday" value="0" />
          </Picker>
          <View style={styles.hourMinuteContainer}>
            <Picker
              style={styles.hourPicker}
              selectedValue={hour}
              onValueChange={handleHour}
            >
              <Picker.Item label="7" value="7" />
              <Picker.Item label="8" value="8" />
              <Picker.Item label="9" value="9" />
              <Picker.Item label="10" value="10" />
              <Picker.Item label="11" value="11" />
              <Picker.Item label="12" value="12" />
              <Picker.Item label="13" value="13" />
              <Picker.Item label="14" value="14" />
              <Picker.Item label="15" value="15" />
              <Picker.Item label="16" value="16" />
              <Picker.Item label="17" value="17" />
              <Picker.Item label="18" value="18" />
              <Picker.Item label="19" value="19" />
              <Picker.Item label="20" value="20" />
              <Picker.Item label="21" value="21" />
            </Picker>
            <Picker
              style={styles.minutesPicker}
              selectedValue={minute}
              onValueChange={handleMinute}
            >
              <Picker.Item label="0" value="0" />
              <Picker.Item label="15" value="15" />
              <Picker.Item label="30" value="30" />
              <Picker.Item label="45" value="45" />
            </Picker>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleAdd}>
              <Text style={styles.formButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setAdding(true);
              }}
            >
              <Text style={styles.formButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <ScrollView style={styles.courseContainer}>
        {courses.map((course) => {
          return (
            <TouchableOpacity
              style={styles.courseStyle}
              onPress={() => {
                Alert.alert(
                  "Delete Class",
                  "Are you sure you want to delete this class?\n" +
                    course.label +
                    "  " +
                    days[course.value.day] +
                    "  " +
                    course.value.time.substring(0, 5),
                  [
                    {
                      text: "No",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: () =>
                        fetch(
                          "http://" +
                            server.server +
                            "/deleteClass?lid=" +
                            course.key,

                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                          }
                        )
                          .then((response) => response.json())
                          .then((json) => {
                            alert("successfully deleted");
                            getClasses();
                          })
                          .catch((error) => {
                            alert(error);
                          }),
                    },
                  ],
                  { cancelable: false }
                );
              }}
            >
              <Text style={styles.courseText}>
                {course.label + "  "} {days[course.value.day] + "  "}
                {course.value.time.substring(0, 5)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.tertiary,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  topContainer: {
    flex: 0.2,
    backgroundColor: colors.tertiary,
    flexDirection: "row",
    alignContent: "stretch",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.tertiary,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: colors.secondary,
    margin: 10,
    borderRadius: 10,
    borderColor: colors.white,
    borderWidth: 1,
    width: 100,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  buttonText: {
    color: colors.white,
    fontSize: 40,
    textAlign: "center",
  },
  courseContainer: {
    flex: 8,
    width: "100%",
    backgroundColor: colors.tertiary,
  },
  courseStyle: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    borderColor: colors.white,
    borderWidth: 1,
    width: "100%",
    height: 60,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  courseText: {
    color: colors.white,
    fontSize: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderColor: colors.white,
    borderWidth: 1,
    width: "90%",
    height: 60,
    marginTop: 10,
    padding: 10,
  },
  dayPicker: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderColor: colors.white,
    borderWidth: 1,
    width: "90%",
    height: 60,
    marginTop: 10,
  },
  hourMinuteContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.tertiary,
    width: "100%",
    justifyContent: "space-around",
  },
  hourPicker: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderColor: colors.white,
    borderWidth: 1,
    width: "40%",
    height: 60,
  },
  minutesPicker: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderColor: colors.white,
    borderWidth: 1,
    width: "40%",
    height: 60,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: colors.tertiary,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  saveButton: {
    backgroundColor: colors.secondary,
    margin: 10,
    borderRadius: 10,
    borderColor: colors.white,
    borderWidth: 1,
    width: "30%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: colors.primary,
    margin: 10,
    borderRadius: 10,
    borderColor: colors.white,
    borderWidth: 1,
    width: "30%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  formButtonText: {
    color: colors.white,
    fontSize: 20,
    textAlign: "center",
  },
});

export default Curriculum;
