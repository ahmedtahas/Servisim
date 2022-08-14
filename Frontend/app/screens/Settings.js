import { React, useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
} from "react-native";
import colors from "../config/colors";
import { AuthContext } from "../config/AuthContext.js";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import server from "../config/server.js";

function Settings(props) {
  const [info, setInfo] = useState(null);

  const { signOut } = useContext(AuthContext);
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

  const handleNotificationTimeSpan = () => {
    fetch("http://" + server.server + "/getUsers?pid=" + pid + "&sid=" + sid)
      .then((response) => response.json())
      .then((json) => {
        handleUsers(json);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleUsers = (json) => {
    console.log(json[0].RequestedNotificationSpan);
    setSpan(json[0].RequestedNotificationSpan);
  };

  const handleSid = (sid) => {
    fetch("http://" + server.server + "/getPlacesBySid?sid=" + sid)
      .then((response) => response.json())
      .then((json) => {
        handlePlaces(json);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handlePlaces = (json) => {
    let places = [];
    json.map((place) => {
      places.push({ label: place.PlaceName, value: place.PlaceID });
    });
    setAdresses(places);
    setAddress(places[0].value);
  };

  const [pid, setPid] = useState(null);
  const [sid, setSid] = useState(null);
  const [time, setTime] = useState(null);
  const [password, setPassword] = useState(null);
  const [adresses, setAdresses] = useState([]);
  const [address, setAddress] = useState(null);
  const [span, setSpan] = useState(null);

  const handleNotificationTime = async (text) => {
    setTime(text);
  };

  useEffect(() => {
    if (pid !== null && sid !== null) {
      handleNotificationTimeSpan();
      fetch("http://" + server.server + "/getUsers?pid=" + pid + "&sid=" + sid)
        .then((response) => response.json())
        .then((json) => {
          handleUser(json);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [pid, sid]);

  const handleUser = (json) => {
    console.log(json[0]);
    setInfo(json[0]);
  };

  useEffect(() => {
    getData("pid").then((value) => {
      setPid(value);
    });
    getData("sid").then((value) => {
      setSid(value);
      handleSid(value);
    });
  }, []);

  const handlePassword = async (text) => {
    setPassword(text);
  };

  const handleUpdate = async () => {
    if (pid !== null && sid !== null && password !== null) {
      fetch("http://" + server.server + "/updatePassword", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pid: pid,
          sid: sid,
          newPassword: password,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.res === "0") {
            alert("Cant update with same password");
          } else {
            alert("Password updated");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.ireMbutton}
        onPress={() => {
          Alert.alert(
            "Info",
            info.Fname +
              " " +
              info.Minit +
              " " +
              info.Lname +
              "\n" +
              info.Pid +
              "\n" +
              info.PlaceName
          );
        }}
      >
        <Text style={styles.buttonText}>My Info</Text>
      </TouchableOpacity>
      <Text>Requested Notification Time</Text>
      {!!span && (
        <TextInput
          style={styles.input}
          placeholder={span + ""}
          onChangeText={handleNotificationTime}
          keyboardType="numeric"
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log(sid, pid, time);
          fetch("http://" + server.server + "/updateNtfSpan", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              pid: pid,
              ntf: time,
              sid: sid,
            }),
          })
            .then((response) => response.json())
            .then((json) => {
              alert("updated successfully");
            })
            .catch((error) => {
              alert("An error occured");
            });
        }}
      >
        <Text style={styles.buttonText}>Set Notification Time</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        onChangeText={handlePassword}
        secureTextEntry={true}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
      <Text>Select Address</Text>
      <Picker
        selectedValue={address}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setAddress(itemValue)}
      >
        {adresses.map((item) => (
          <Picker.Item label={item.label} value={item.value} />
        ))}
      </Picker>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log(address);
          fetch("http://" + server.server + "/updateAddress", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              pid: pid,
              sid: sid,
              newAddress: address,
            }),
          })
            .then((response) => response.json())
            .then((json) => {
              alert("updated successfully");
            })
            .catch((error) => {
              alert("An error occured");
            });
        }}
      >
        <Text style={styles.buttonText}>Update Address</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          signOut();
        }}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 20,
    textAlign: "center",
  },
  input: {
    borderColor: colors.darkgray,
    backgroundColor: colors.white,
    borderWidth: 1,
    padding: 10,
    margin: 10,
    width: 200,
    borderRadius: 10,
  },
  picker: {
    width: 200,
    height: 50,
    backgroundColor: colors.white,
    margin: 10,
    borderRadius: 10,
  },
  ireMbutton: {
    backgroundColor: colors.irem,
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
});

export default Settings;
