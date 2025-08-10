import Button from "@/components/Button";
import Wrapper from "@/components/Wrapper";
import AppColors from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

const ProfileScreen = () => {
  const { checkSession, error, login, isLoading, logout, signup, user } =
    useAuthStore();
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      checkSession();
    }
  }, [user]);
  return (
    <Wrapper>
      {user ? (
        <View style={styles.container}>
          <Text>ProfileScreen</Text>
          <Button
            onPress={logout}
            title="log out"
            fullWidth
            variant="outline"
          />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.message}>
            Please login or signup to access your profile and enjoy all
            features.
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              title="Log in"
              fullWidth
              size="small"
              onPress={() => {
                router.push("/(tabs)/login");
              }}
            />
            <Button
              title="Sign up"
              variant="outline"
              size="small"
              onPress={() => {
                router.push("/(tabs)/signup");
              }}
            />
          </View>
        </View>
      )}
    </Wrapper>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColors.background.primary,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: AppColors.text.primary,
  },
  message: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: AppColors.text.secondary,
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
});
