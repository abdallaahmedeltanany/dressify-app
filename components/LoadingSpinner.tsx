import AppColors from "@/constants/Colors";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "large",
  color = AppColors.primary[700],
  text = "Loading...",
  fullScreen = false,
}) => {
  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <ActivityIndicator size={size} color={color} />
        <Text style={styles.text}>{text}</Text>
      </View>
    );
  }
  return (
    <View style={styles.fullScreen}>
      <ActivityIndicator size={size} color={color} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default LoadingSpinner;
const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 5,
    backgroundColor: AppColors.background.primary,
  },
  container: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: AppColors.primary[700],
    fontSize: 14,
    marginLeft: 10,
  },
});
