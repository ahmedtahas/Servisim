import { React, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import colors from "../config/colors";
import server from "../config/server";

function Places(props) {
  const [allPlaces, setAllPlaces] = useState([]);
  const [place, setPlace] = useState("");

  const getAllPlaces = async () => {
    const response = await fetch("http://" + server.server + "/getPlaces", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        handlePlaces(json);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const addPlace = async () => {
    const response = await fetch("http://" + server.server + "/addPlace", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        placename: place,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        getAllPlaces();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetch("http://" + server.server + "/getPlaces", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        handlePlaces(json);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handlePlaces = (place) => {
    let places = [];
    place.map((place) => {
      places.push({
        label: place.PlaceName,
        value: place.PlaceID,
      });
    });
    setAllPlaces(places);
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewContainer}>
        <Text style={styles.title}>Places</Text>
        <TextInput
          style={styles.input}
          placeholder="Place Name"
          onChangeText={(text) => {
            setPlace(text);
          }}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            addPlace();
          }}
        >
          <Text style={styles.buttonText}>Add Place</Text>
        </TouchableOpacity>
        <Text style={styles.title}>All Places</Text>

        <ScrollView style={{ width: "100%" }}>
          <View style={styles.scrollView}>
            {allPlaces.map((place) => {
              return (
                <View style={styles.placeContainer}>
                  <Text style={styles.placeText}>{place.label}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  viewContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    color: colors.primary,
    marginTop: 20,
    marginBottom: 20,
  },
  placeContainer: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    margin: 10,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  placeText: {
    fontSize: 20,
    color: colors.white,
  },
  input: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
    borderWidth: 1,
    padding: 10,
    margin: 10,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 10,
    margin: 10,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    color: colors.white,
  },
  scrollView: {
    width: "100%",
    height: "50%",
    backgroundColor: colors.tertiary,
    borderRadius: 10,
    padding: 10,
    marginTop: 70,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Places;
