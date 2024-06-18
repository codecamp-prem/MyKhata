import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import Background from "../components/ui/Background";
import Button from "../components/ui/Button";
import Header from "../components/ui/Header";
import Logo from "../components/ui/Logo";
import TextInput from "../components/ui/TextInput";
import { theme } from "../core/theme";

export default function LoginScreen() {
  const db = useSQLiteContext();
  const navigation = useNavigation();

  const [password, setPassword] = useState({ value: "", error: "" });

  const hashPassword = (password: string, salt: string = ""): string => {
    let hash = 0;
    const input = password + salt;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return `${hash}:${salt}`;
  };

  const passwordValidator = async (password: string) => {
    if (!password) return "Password can't be empty.";
    if (password.length < 5) {
      //return "Password must be at least 5 characters long.";
      return "Password is Incorrect!!";
    }
    try {
      // convert the password to Custom Hash RaviPasal
      const hashedPassword = hashPassword(password, "##MyKhata##");
      const passwordVerifyResultFromDB = await db.getFirstAsync(
        "SELECT * FROM Login WHERE login_password=?",
        [hashedPassword]
      );
      if (!passwordVerifyResultFromDB) {
        return "Password is Incorrect!!";
      }
    } catch (error) {
      console.error("Error validating password:", error);
      return "An error occurred while validating the password.";
    }

    return "";
  };

  const onLoginPressed = async () => {
    const passwordError = await passwordValidator(password.value);
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
