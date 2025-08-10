import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import Wrapper from "@/components/Wrapper";
import AppColors from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import { Foundation } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, isLoading, login } = useAuthStore();
  const handleSignin = async () => {
    // Validate first
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Missing fields",
        text2: "Email and password are required",
      });
      return;
    }

    try {
      const success = await login(email, password);

      if (success) {
        Toast.show({
          type: "success",
          text1: "Signed in successfully",
          text2: "Welcome back!",
        });
        router.push("/");
        setEmail("");
        setPassword("");
      } else {
        Toast.show({
          type: "error",
          text1: "Sign in failed",
          text2: error ?? "Invalid credentials or network error",
        });
      }
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Sign in failed",
        text2: err?.message ?? "Unexpected error",
      });
    }
  };
  return (
    <Wrapper>
      <KeyboardAvoidingView>
        <ScrollView>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Foundation
                name="shopping-cart"
                size={50}
                color={AppColors.primary[500]}
              />
            </View>
            <Text style={styles.title}>Dressify</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>
          <View style={styles.form}>
            <CustomInput
              label="Email"
              placeholder="Please enter email"
              value={email}
              onChangeText={setEmail}
              secureTextEntry={false}
              keyboardType="email-address"
            />

            <CustomInput
              label="Password"
              placeholder="Please enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* Buttons */}
            <View style={styles.buttonsContainer}>
              <Button
                title="Sign in"
                fullWidth
                size="large"
                onPress={handleSignin}
                variant="primary"
                loading={isLoading}
              />
              <View style={styles.innerContainer}>
                <Text style={styles.text}>Don&apos;t have an account?</Text>
                <TouchableOpacity onPress={() => router.push("/(tabs)/signup")}>
                  <Text style={styles.buttonText}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Wrapper>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 5,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: AppColors.primary[50],
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter-bold",
    color: AppColors.text.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: AppColors.text.tertiary,
  },
  form: {
    flexDirection: "column",
    gap: 20,
  },
  buttonsContainer: {
    marginTop: 30,
    flexDirection: "column",
    gap: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    flexDirection: "row",
    gap: 3,
  },
  text: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: AppColors.text.tertiary,
  },
  buttonText: {
    fontFamily: "Inter-bold",
    color: AppColors.primary[500],
    fontSize: 14,
  },
});
