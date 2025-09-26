import AppColors from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import { Dimensions, StatusBar, StyleSheet, Text, View } from "react-native";
const { width, height } = Dimensions.get("window");

const SplashScreen = () => {
  const { user, checkSession } = useAuthStore();
  const router = useRouter();
  const animationRef = useRef(null);
  useEffect(() => {
    if (!user) {
      checkSession();
    }
  }, []);
  const onAnimationFinish = () => {
    console.log(user);
    if (!user) {
      router.replace("/(auth)/login");
    } else {
      router.replace("/(tabs)/home");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Text style={styles.welcomeText}>Dressify</Text>

      <LottieView
        ref={animationRef}
        source={require("../../assets/animations/Splash.json")}
        style={styles.animation}
        autoPlay={true}
        loop={false}
        speed={2}
        onAnimationFinish={onAnimationFinish}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: width * 0.5,
    height: height * 0.5,
  },
  mainApp: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 40,
    fontFamily: "Inter-Bold",
    color: AppColors.primary[400],
    marginBottom: -70,
  },
});
