import { React, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import colors from "../config/colors";
import Upcoming from "./Upcoming";
import Curriculum from "./Curriculum";
import Rings from "./Rings";
import Settings from "./Settings";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

function HomeScreen(props) {
  const [upcoming, setUpcoming] = useState(true);
  const [curriculum, setCurriculum] = useState(false);
  const [rings, setRings] = useState(false);

  const handleUpcoming = () => {
    setUpcoming(true);
    setCurriculum(false);
    setRings(false);
  };
  const handleCurriculum = () => {
    setUpcoming(false);
    setCurriculum(true);
    setRings(false);
  };
  const handleRings = () => {
    setUpcoming(false);
    setCurriculum(false);
    setRings(true);
  };
  const handleSettings = () => {
    setUpcoming(false);
    setCurriculum(false);
    setRings(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewContainer}>
        {upcoming ? (
          <Upcoming />
        ) : curriculum ? (
          <Curriculum />
        ) : rings ? (
          <Rings />
        ) : (
          <Settings />
        )}
      </View>
      <View style={styles.buttonContainer}>
        {upcoming ? (
          <>
            <TouchableOpacity
              style={styles.currentButton}
              onPress={handleUpcoming}
            >
              <MaterialCommunityIcons
                name={"bell-ring"}
                solid
                style={styles.icon}
              />
              <Text style={styles.buttonText}>Upcoming</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={handleUpcoming}>
              <MaterialCommunityIcons
                name={"bell-ring"}
                solid
                style={styles.icon}
              />
            </TouchableOpacity>
          </>
        )}

        <View style={styles.seperator} />
        {curriculum ? (
          <>
            <TouchableOpacity
              style={styles.currentButton}
              onPress={handleCurriculum}
            >
              <MaterialCommunityIcons
                name={"calendar-multiselect"}
                solid
                style={styles.icon}
              />
              <Text style={styles.buttonText}>Curriculum</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={handleCurriculum}>
              <MaterialCommunityIcons
                name={"calendar-multiselect"}
                solid
                style={styles.icon}
              />
            </TouchableOpacity>
          </>
        )}

        <View style={styles.seperator} />
        {rings ? (
          <>
            <TouchableOpacity
              style={styles.currentButton}
              onPress={handleRings}
            >
              <MaterialCommunityIcons name={"bus"} solid style={styles.icon} />
              <Text style={styles.buttonText}>Rings</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={handleRings}>
              <MaterialCommunityIcons name={"bus"} solid style={styles.icon} />
            </TouchableOpacity>
          </>
        )}

        <View style={styles.seperator} />
        {!upcoming && !curriculum && !rings ? (
          <>
            <TouchableOpacity
              style={styles.currentButton}
              onPress={handleSettings}
            >
              <Feather name={"settings"} solid style={styles.icon} />
              <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={handleSettings}>
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

export default HomeScreen;
