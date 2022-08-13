import { React, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../config/colors";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Transports from "./Transports";
import Places from "./Places";
import Controls from "./Controls";

function AdminScreen(props) {
  const [transports, setTransports] = useState(false);
  const [places, setPlaces] = useState(true);
  const [controls, setControls] = useState(false);

  const handleTransports = () => {
    setTransports(true);
    setPlaces(false);
    setControls(false);
  };
  const handlePlaces = () => {
    setTransports(false);
    setPlaces(true);
    setControls(false);
  };
  const handleControls = () => {
    setTransports(false);
    setPlaces(false);
    setControls(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewContainer}>
        {transports ? (
          <Transports />
        ) : places ? (
          <Places />
        ) : controls ? (
          <Controls />
        ) : (
          <></>
        )}
      </View>
      <View style={styles.buttonContainer}>
        {places ? (
          <>
            <TouchableOpacity
              style={styles.currentButton}
              onPress={handlePlaces}
            >
              <MaterialCommunityIcons
                name={"routes"}
                solid
                style={styles.icon}
              />
              <Text style={styles.buttonText}>Places</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={handlePlaces}>
              <MaterialCommunityIcons
                name={"routes"}
                solid
                style={styles.icon}
              />
            </TouchableOpacity>
          </>
        )}

        <View style={styles.seperator} />
        {transports ? (
          <>
            <TouchableOpacity
              style={styles.currentButton}
              onPress={handleTransports}
            >
              <MaterialCommunityIcons name={"bus"} solid style={styles.icon} />
              <Text style={styles.buttonText}>Transports</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={handleTransports}>
              <MaterialCommunityIcons name={"bus"} solid style={styles.icon} />
            </TouchableOpacity>
          </>
        )}

        <View style={styles.seperator} />
        {controls ? (
          <>
            <TouchableOpacity
              style={styles.currentButton}
              onPress={handleControls}
            >
              <Feather name={"settings"} solid style={styles.icon} />
              <Text style={styles.buttonText}>Controls</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={handleControls}>
              <Feather name={"settings"} solid style={styles.icon} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    fontSize: 50,
    color: colors.white,
  },
  viewContainer: {
    flex: 8,
    backgroundColor: colors.tertiary,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: colors.tertiary,
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "stretch",
  },
  button: {
    backgroundColor: colors.primary,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  currentButton: {
    backgroundColor: colors.secondary,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  seperator: {
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    textAlign: "center",
  },
});

export default AdminScreen;
