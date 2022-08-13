import { React, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import colors from "../config/colors";
import server from "../config/server";

function Rings(props) {
  const [sid, setSid] = useState(null);
  const [rings, setRings] = useState([]);
  const [from, setFrom] = useState(false);
  const [place, setPlace] = useState(null);
  const [stop, setStop] = useState(null);
  const [stopID, setStopID] = useState(null);

  useEffect(() => {
    getData("sid").then((value) => {
      setSid(value);
    });
  }, []);

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
    if (sid !== null) {
      fetch("http://" + server.server + "/getAllTransportsBySid?sid=" + sid)
        .then((response) => response.json())
        .then((json) => {
          handleRings(json);
        })
        .catch((error) => {
          console.error(error);
        });
      fetch("http://" + server.server + "/getPlacesBySid?sid=" + sid)
        .then((response) => response.json())
        .then((json) => {
          handlePlaces(json);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [sid]);

  const handleFilter = () => {
    console.log(sid, stop, "AAAA");
    if (from) {
      fetch(
        "http://" +
          server.server +
          "/getTransportsFromSchool?sid=" +
          sid +
          "&placeID=" +
          stop
      )
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          handleRings(json);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      fetch(
        "http://" +
          server.server +
          "/getTransportsToSchool?sid=" +
          sid +
          "&placeID=" +
          stop
      )
        .then((response) => response.json())
        .then((json) => {
          handleRings(json);
          console.log(json);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handlePlaces = (json) => {
    let places = [];
    json.map((place) => {
      places.push({
        label: place.PlaceName,
        value: place.PlaceID,
      });
    });
    setPlace(places);
    setStop(places[0].value);
  };

  const handleRings = (json) => {
    let rings = [];
    json.map((ring) => {
      rings.push({
        label: {
          from: ring.From,
          to: ring.To,
          time: ring.Time,
          plate: ring.Plate,
          phone: ring.PhoneNumber,
        },
        value: ring.Tid,
      });
    });
    setRings(rings);
  };

  const handleStop = (text) => {
    setStop(place[text].label);
    setStopID(place[text].value);
    console.log(place[text].label, place[text].value);
  };
  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            backgroundColor: colors.tertiary,
          }}
        >
          <View style={[styles.button, { alignItems: "center" }]}>
            {from ? (
              <TouchableOpacity
                onPress={() => {
                  setFrom(false);
                }}
              >
                <Text style={styles.text}>From School</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setFrom(true);
                }}
              >
                <Text style={styles.text}>To School</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleFilter}>
            <Text style={styles.text}>Filter</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.picker}>
          {stop && (
            <Picker
              style={{
                flex: 1,
              }}
              selectedValue={stop}
              onValueChange={(item) => {
                setStop(item);
              }}
            >
              {place.map((plac) => {
                return (
                  <Picker.Item
                    key={plac.value}
                    label={plac.label}
                    value={plac.value}
                  />
                );
              })}
            </Picker>
          )}
        </View>
      </View>
      <View style={styles.ringContainer}>
        <ScrollView
          style={{ flex: 1, backgroundColor: colors.tertiary, width: "100%" }}
        >
          {rings.map((ring) => {
            return (
              <TouchableOpacity
                style={styles.ring}
                onPress={() => {
                  Alert.alert(
                    "Info",
                    ring.label.from +
                      " => " +
                      ring.label.to +
                      " at " +
                      ring.label.time +
                      "\nPlate: " +
                      ring.label.plate +
                      "\nPhone:" +
                      ring.label.phone
                  );
                }}
              >
                <Text>
                  {ring.label.from + " => "}
                  {ring.label.to + " at "}
                  {ring.label.time.substring(0, 5)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.tertiary,
    flexDirection: "column",
    justifyContent: "space-around",
    alignContent: "stretch",
    alignItems: "center",
  },
  ringContainer: {
    flex: 6,
    backgroundColor: colors.tertiary,
    flexDirection: "column",
    justifyContent: "space-around",
    alignContent: "stretch",
    alignItems: "center",
    width: "100%",
  },
  ring: {
    flex: 1,
    backgroundColor: colors.white,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.darkgray,
    borderRadius: 10,
    width: "95%",
    padding: 10,
    margin: 10,
  },
  ringText: {
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "italic",
    fontFamily: "sans-serif-condensed",
    color: colors.darkgray,
  },
  filterContainer: {
    flex: 1,
    backgroundColor: colors.tertiary,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    padding: 10,
    margin: 10,
  },
  picker: {
    width: "45%",
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.darkgray,
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  text: {
    fontSize: 20,
    fontFamily: "sans-serif-condensed",
    color: colors.darkgray,
  },
  button: {
    width: "100%",
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.darkgray,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    alignItems: "center",
  },
});

export default Rings;
