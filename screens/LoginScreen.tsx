import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import Background from "../components/ui/Background";
import Button from "../components/ui/Button";
import Header from "../components/ui/Header";
import Logo from "../components/ui/Logo";
import TextInput from "../components/ui/TextInput";
import { theme } from "../core/theme";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [password, setPassword] = useState({ value: "", error: "" });

  const onLoginPressed = () => {
    const passwordError = passwordValidator(password.value);
    if (passwordError) {
      setPassword({ ...password, error: passwordError });
      return;
    }
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" } as never],
    });
  };

  return (
    <Background>
      {/* <BackButton goBack={navigation.goBack} /> */}
      <Logo />
      <Header>Welcome back.</Header>
      <TextInput
        placeholder="Enter Your Password"
        aria-label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text: string) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
    </Background>
  );
}

function passwordValidator(password: string) {
  if (!password) return "Password can't be empty.";
  if (password.length < 5)
    return "Password must be at least 5 characters long.";
  return "";
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});
