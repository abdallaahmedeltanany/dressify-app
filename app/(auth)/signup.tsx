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
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const SignupScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const { isLoading, signup } = useAuthStore();

  const validateForm = () => {
    const errors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Set input field error states
    setEmailError(errors.email || "");
    setPasswordError(errors.password || "");
    setConfirmError(errors.confirmPassword || "");

    // Show first error toast
    if (errors.email) {
      Toast.show({
        type: "error",
        text1: "Signup Failed",
        text2: errors.email,
      });
    } else if (errors.password) {
      Toast.show({
        type: "error",
        text1: "Signup Failed",
        text2: errors.password,
      });
    } else if (errors.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Signup Failed",
        text2: errors.confirmPassword,
      });
    }

    return Object.keys(errors).length === 0;
  };

  const signUp = async () => {
    try {
      if (!validateForm()) return;

      await signup(email, password);
      Toast.show({
        type: "success",
        text1: "Sign up successfully",
        text2: "your account was created successfully",
      });
      router.push("/(auth)/login");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Signup Error",
        text2: "Something went wrong. Please try again.",
      });
    }
  };
  const handleLoginRouter = () => {
    router.dismissAll();
    router.replace("/(auth)/login");
  };

  return (
    <Wrapper>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Foundation
                name="shopping-cart"
                size={50}
                color={AppColors.primary[500]}
              />
            </View>
            <Text style={styles.title}>Dressify</Text>
            <Text style={styles.subtitle}>Create a new account</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <CustomInput
              label="Email"
              placeholder="Please enter email"
              value={email}
              onChangeText={setEmail}
              secureTextEntry={false}
              keyboardType="email-address"
              error={emailError}
            />

            <CustomInput
              label="Password"
              placeholder="Please enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={passwordError}
            />

            <CustomInput
              label="Confirm Password"
              placeholder="Please confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              error={confirmError}
            />

            {/* Buttons */}
            <View style={styles.buttonsContainer}>
              <Button
                title="Sign up"
                fullWidth
                size="large"
                onPress={signUp}
                variant="primary"
                loading={isLoading}
              />
              <View style={styles.innerContainer}>
                <Text style={styles.text}>Already have an account?</Text>
                <TouchableOpacity onPress={handleLoginRouter}>
                  <Text style={styles.buttonText}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Wrapper>
  );
};

export default SignupScreen;

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
