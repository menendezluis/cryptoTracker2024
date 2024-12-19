import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Colors from "../../constants/Colors";
import ButtonCrypto from "../../components/ButtonCrypto";
import { AuthContext } from "../../auth/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const URL = "https://dummyjson.com/user/login";
  const handleLogin = async () => {
    try {
      if (username === "emily" && password === "emilyspass") {
        const response = await fetch(URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "emilys",
            password: "emilyspass",
            expiresInMins: 30, // optional, defaults to 60
          }),
          credentials: "include", // Include cookies (e.g., accessToken) in the request
        });

        const data = await response.json();
        login({
          id: data.id,
          name: data.firstName + " " + data.lastName,
          email: data.email,
        });
      } else if (password === "" && username !== "") {
        login({ id: "Guest", name: username, email: username });
      } else {
        Alert.alert("Login required", "Please introduce at least a username");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subTitle}>Sign in to continue</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={Colors.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => setUsername(text)}
            value={username}
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
            placeholder="Password"
            placeholderTextColor={Colors.placeholder}
            secureTextEntry
            value={password}
          />
        </View>

        <View style={styles.buttonContainer}>
          <ButtonCrypto title="Login" onPress={handleLogin} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Username:</Text>
          <TouchableOpacity onPress={() => setUsername("emily")}>
            <Text style={styles.signUp}>emily</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Password:</Text>
          <TouchableOpacity onPress={() => setPassword("emilyspass")}>
            <Text style={styles.signUp}>emilyspass</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            If you don’t enter a password, you can sign in as a visitor.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    color: Colors.subtitle,
  },
  inputContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  forgotPassword: {
    textAlign: "right",
    color: Colors.link,
    fontSize: 14,
    marginBottom: 20,
  },
  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 14,
    color: Colors.subtitle,
  },
  signUp: {
    fontSize: 14,
    color: Colors.link,
    fontWeight: "600",
    marginLeft: 5,
  },
});

export default Login;
