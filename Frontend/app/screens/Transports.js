import { React, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../config/colors";
import server from "../config/server";

function Transports(props) {
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
  useEffect(() => {
    getData("sid").then((value) => {
      setSid(value);
    });
  }, []);

  const [sid, setSid] = useState("");
  const [allTransports, setAllTransports] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [allDestinations, setAllDestinations] = useState([]);
  const [plate, setPlate] = useState("");
  const [phone, setPhone] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");

  useEffect(() => {
    fetch("http://" + server.server + "/getAllTransportsBySid?sid=" + sid, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        handleTransports(json);
      })
      .catch((error) => {
        console.error(error);
      });
    fetch("http://" + server.server + "/getPlacesBySidWSchool?sid=" + sid, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        handleDestinations(json);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [sid]);

  const getAllTransportsBySid = async () => {
    const response = await fetch(
      "http://" + server.server + "/getAllTransportsBySid?sid=" + sid,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        handleTransports(json);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDestinations = (json) => {
    let destinations = [];
    json.map((destination) => {
      destinations.push({
        label: destination.PlaceName,
        value: destination.PlaceID,
      });
    });
    setAllDestinations(destinations);
  };

  const handleTransports = (json) => {
    let transports = [];
    json.forEach((transport) => {
      transports.push({
        id: transport.Tid,
        from: transport.From,
        to: transport.To,
        plate: transport.Plate,
        phone: transport.PhoneNumber,
        time: transport.Time,
      });
    });
    setAllTransports(transports);
  };

  return (
    <View style={styles.container}>
      <View style={styles.destinations}>
        <Picker
          selectedValue={from}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setFrom(itemValue)}
        >
          {allDestinations.map((destination) => (
            <Picker.Item
              style={styles.pickerItem}
              key={destination.value}
              label={destination.label}
              value={destination.value}
            />
          ))}
        </Picker>
        <Picker
          selectedValue={to}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setTo(itemValue)}
        >
          {allDestinations.map((destination) => (
            <Picker.Item
              style={styles.pickerItem}
              key={destination.value}
              label={destination.label}
              value={destination.value}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Plate"
          onChangeText={(text) => {
            setPlate(text);
          }}
          value={plate}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          onChangeText={(text) => {
            setPhone(text);
          }}
          value={phone}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Hour"
          onChangeText={(text) => {
            setHour(text);
          }}
          value={hour}
        />
        <TextInput
          style={styles.input}
          placeholder="Minute"
          onChangeText={(text) => {
            setMinute(text);
          }}
          value={minute}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          fetch("http://" + server.server + "/addTransport", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sid: sid,
              from: from,
              to: to,
              plate: plate,
              phone: phone,
              hour: hour,
              minute: minute,
            }),
          })
            .then((response) => response.json())
            .then((json) => {
              console.log(json);
              props.navigation.navigate("Transports");
            })
            .catch((error) => {
              console.error(error);
            });
          getAllTransportsBySid();
        }}
      >
        <Text style={styles.buttonText}>Add Transport</Text>
      </TouchableOpacity>

      <View style={styles.scrollViewContainer}>
        <ScrollView>
          {allTransports.map((transport) => (
            <TouchableOpacity
              key={transport.id}
              style={styles.transport}
              onPress={() => {
                Alert.alert(
                  "Delete Transport",
                  "Are you sure you want to delete this transport?" +
                    "\nFrom: " +
                    transport.from +
                    "\nTo: " +
                    transport.to +
                    "\nPlate: " +
                    transport.plate +
                    "\nPhone Number: " +
                    transport.phone +
                    "\nTime: " +
                    transport.time,
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "OK",
                      onPress: () => {
                        fetch(
                          "http://" +
                            server.server +
                            "/deleteTransport?tid=" +
                            transport.id,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                          }
                        )
                          .then((response) => response.json())
                          .then((json) => {
                            console.log(json);
                            getAllTransportsBySid();
                          })
                          .catch((error) => {
                            console.error(error);
                          });
                      },
                    },
                  ],
                  { cancelable: false }
                );
              }}
            >
              <Text style={styles.text}>
                {transport.from + " => "}
                {transport.to + " @ "}
                {transport.time.substring(0, 5)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.tertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  destinations: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  picker: {
    width: "50%",
    height: 50,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
  },
  pickerItem: {
    height: 50,
    color: colors.primary,
  },
  scrollViewContainer: {
    flex: 1,
    backgroundColor: colors.tertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    margin: 10,
  },
  transport: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  input: {
    width: "50%",
    height: 50,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  buttonText: {
    color: colors.tertiary,
    fontSize: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});

export default Transports;
