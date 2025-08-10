import AppColors from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const Logo = () => {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.logoView} onPress={() => router.push("/")}>
      <MaterialIcons
        name="shopping-cart"
        size={25}
        color={AppColors.primary[700]}
      />
      <Text style={styles.logoText}>Shopping Cart</Text>
    </TouchableOpacity>
  );
};

export default Logo;

const styles = StyleSheet.create({
  logoView: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: AppColors.primary[700],
    marginLeft: 2,
  },
});
