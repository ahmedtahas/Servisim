import { React, useState, useEffect, useContext, createContext } from "react";
import colors from "../config/colors.js";
import server from "../config/server.js";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { AuthContext } from "../config/AuthContext.js";

function LoginScreen(props) {
  const [schools, setSchools] = useState([]);
  const [school, setSchool] = useState(null);
  const [sid, setSid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://" + server.server + "/getSchools")
      .then((response) => response.json())
      .then((json) => {
        handleSchools(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSchools = (json) => {
    setSchool(json[0].Sname);
    setSid("" + json[0].Sid);
    let schl = [];
    json.map((school) => {
      schl.push({ label: school.Sname, value: school.Sid });
    });
    setSchools(schl);
  };

  const storePid = async (text) => {
    try {
      await AsyncStorage.setItem("pid", text);
    } catch (error) {
      console.log(error);
    }
  };
  const storeSid = async (text) => {
    try {
      await AsyncStorage.setItem("sid", text);
    } catch (error) {
      console.log(error);
    }
  };

  const { signIn } = useContext(AuthContext);
  const [pid, setPid] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    storeSid(sid);

    fetch(
      "http://" +
        server.server +
        "/checkCredentials?pid=" +
        pid +
        "&password=" +
        password +
        "&sid=" +
        sid
    )
      .then((response) => response.json())
      .then((json) => {
        if (json === 1) {
          console.log("hello");
          signIn({ pid, password });
          props.navigation.navigate("Admin");
        } else if (json === 2) {
          signIn({ pid, password });
          props.navigation.navigate("Home");
        } else {
          alert("Invalid credentials");
        }
      });
  };
  const handleSignup = () => {
    props.navigation.navigate("Signup");
  };
  const handlePid = (text) => {
    setPid(text);
    storePid(text);
  };
  const handlePassword = (text) => {
    setPassword(text);
  };

  return (
    <>
      <View style={styles.container}>
        <MaterialCommunityIcons
          name={"bus-side"}
          solid
          size={120}
          style={styles.icon}
        />
        <Text style={[styles.text, { bottom: 100 }]}>Servisim</Text>
        <View style={{ height: 50 }} />
        <StatusBar style="auto" />
        <View style={{ bottom: 75 }}>
          {!loading && (
            <View style={styles.picker}>
              <Picker
                selectedValue={school}
                onValueChange={(itemValue) => {
                  setSchool("" + itemValue);
                }}
              >
                {schools.map((schl) => {
                  return (
                    <Picker.Item
                      key={schl.value}
                      label={schl.label}
                      value={schl.value}
                    />
                  );
                })}
              </Picker>
            </View>
          )}
          <TextInput
            style={styles.input}
            placeholder="School ID"
            onChangeText={handlePid}
            keyboardType="number-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={handlePassword}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={{ fontSize: 20 }}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={{ fontSize: 20 }}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.tertiary,
    alignItems: "center",
    alignContent: "space-around",
    justifyContent: "center",
  },
  icon: {
    bottom: 100,
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
    fontStyle: "italic",
    fontFamily: "sans-serif-condensed",
    color: colors.darkgray,
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 10,
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  signupButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
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
    borderColor: colors.darkgray,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colors.white,
    margin: 10,
  },
});

export default LoginScreen;
