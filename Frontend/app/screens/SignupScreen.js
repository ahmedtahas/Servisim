import { useState, React, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import LottieView from "lottie-react-native";
import colors from "../config/colors";
import server from "../config/server";

function SignupScreen(props) {
  useEffect(() => {
    fetch("http://" + server.server + "/getSchools")
      .then((response) => response.json())
      .then((json) => {
        setSchool(json);
        setGotSchools(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const [user, setUser] = useState({
    name: "",
    pid: "",
    password: "",
    sid: "",
    address: "",
    type: 0,
  });
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState([]);
  const [gotSchools, setGotSchools] = useState(false);
  const [schoolsValue, setSchoolsValue] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [addressesValue, setAddressesValue] = useState("");
  const [gotAddresses, setGotAddresses] = useState(false);

  useEffect(() => {
    console.log("schoolsValue AAAAAA: " + schoolsValue);

    console.log("schoolsValue: " + schoolsValue + "AAAAAAAAAAAAAAAAc");
    const fetchData = async () => {
      const data = await fetch(
        "http://" + server.server + "/getPlacesBySid?sid=" + schoolsValue
      );
      const json = await data.json();
      handleAddresses(json);
      setGotAddresses(true);
      setAddressesValue(json[0].PlaceID);
    };

    fetchData().catch((error) => {
      console.error(error);
    });
  }, [schoolsValue]);

  const handleAddresses = (json) => {
    let address = [];
    json.map((item) => {
      address.push({ label: item.PlaceName, value: item.PlaceID });
    });
    setAddresses(address);
  };

  const handleSchoolValue = (value) => {
    setSchoolsValue(value);
    setUser({ ...user, sid: value });
  };

  const setSchool = (json) => {
    setSchoolsValue(json[0].Sid);
    json.map((school) => {
      schools.push({ label: school.Sname, value: school.Sid });
    });
  };

  const handleName = (text) => {
    setUser({ ...user, name: text });
  };
  const handleSchoolID = (text) => {
    setUser({ ...user, pid: text });
  };
  const handlePassword = (text) => {
    setUser({ ...user, password: text });
  };
  const handlePasswordCheck = (text) => {
    console.log(text);
    setPassword(text);
  };

  const handleNavigation = () => {
    navigation.goBack();
  };

  const handleSubmission = async () => {
    try {
      let response = await fetch("http://" + server.server + "/addUser", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      let json = await response.json();
      console.log(json);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    console.log(password);
    if (user.password === password) {
      user.sid = schoolsValue;
      user.address = addressesValue;
      setLoading(true);
      await handleSubmission();
      setLoading(false);
      handleNavigation();
    } else {
      alert("Passwords does not match");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Signup</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Name"
        onChangeText={handleName}
      />
      <TextInput
        style={styles.textInput}
        placeholder="School ID"
        onChangeText={handleSchoolID}
        keyboardType="number-pad"
      />
      <TextInput
        style={styles.textInput}
        placeholder="Password"
        onChangeText={handlePassword}
        secureTextEntry={true}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Confirm Password"
        onChangeText={handlePasswordCheck}
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>
      {gotSchools && (
        <View style={styles.dropdown}>
          <Picker
            selectedValue={schoolsValue}
            style={{ height: 50, width: 200 }}
            onValueChange={(itemValue, itemIndex) =>
              handleSchoolValue(itemValue)
            }
          >
            {schools.map((school) => {
              return <Picker.Item label={school.label} value={school.value} />;
            })}
          </Picker>
        </View>
      )}
      {gotAddresses && (
        <View style={styles.dropdown}>
          <Picker
            selectedValue={addressesValue}
            style={{ height: 50, width: 200 }}
            onValueChange={(itemValue, itemIndex) =>
              setAddressesValue(itemValue)
            }
          >
            {addresses.map((address) => {
              return (
                <Picker.Item label={address.label} value={address.value} />
              );
            })}
          </Picker>
        </View>
      )}

      {!!loading && (
        <LottieView
          style={[StyleSheet.absoluteFill, styles.loading]}
          source={require("../assets/animations/loading.json")}
          autoPlay
          loop
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.tertiary,
    alignItems: "center",
  },
  textInput: {
    borderColor: colors.darkgray,
    backgroundColor: colors.white,
    borderWidth: 1,
    padding: 10,
    margin: 10,
    width: 200,
    borderRadius: 10,
  },
  header: {
    fontSize: 30,
    margin: 10,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    margin: 10,
    width: 200,
    borderRadius: 10,
    position: "absolute",
    bottom: 0,
  },
  buttonText: {
    color: colors.white,
    fontSize: 20,
    textAlign: "center",
  },
  dropdown: {
    width: 200,
    margin: 10,
    backgroundColor: colors.white,
    borderColor: colors.darkgray,
    borderWidth: 1,
    borderRadius: 10,
  },
  dropdownContainer: {
    backgroundColor: colors.tertiary,
    margin: 10,
    width: 200,
    height: 50,
  },
  dropdownContainer2: {
    backgroundColor: colors.tertiary,
    margin: 10,
    width: 200,
    height: 50,
    top: 50,
  },
  dropdownText: {
    fontSize: 14,
    opacity: 0.4,
  },
  loading: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default SignupScreen;
