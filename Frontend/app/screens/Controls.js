import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { AuthContext } from "../config/AuthContext.js";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../config/colors.js";

function Controls(props) {
  const { signOut } = useContext(AuthContext);
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
  const [studentID, setStudentID] = useState("");
  
  return (
    <View style={styles.container}>
      <View style={styles.student}>
        <TextInput
          style={styles.input}
          placeholder="Student ID"
          onChangeText={(text) => setStudentID(text)}
          value={studentID}
        />
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Get Password</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            signOut();
          }}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: "10%",
    backgroundColor: colors.background,
  },
  button: {
    backgroundColor: colors.primary,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 10,
    margin: 10,
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
  student: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: "10%",
    backgroundColor: colors.background,
  },
});

export default Controls;
