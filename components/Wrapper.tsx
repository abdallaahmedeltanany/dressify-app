import AppColors from "@/constants/Colors";
import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
};

export default Wrapper;

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
    // marginTop: Platform.OS === "android" ? 30 : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
