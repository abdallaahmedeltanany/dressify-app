import AppColors from "@/constants/Colors";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
interface Props {
  isFav?: boolean;
  handleToggleFavorite?: () => void;
}
const CommonHeader = ({ handleToggleFavorite }: Props) => {
  const router = useRouter();
  const isFav = false;

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/");
    }
  };
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.BackButton} onPress={handleGoBack}>
        <Feather name="arrow-left" size={20} color={AppColors.text.primary} />
      </TouchableOpacity>

      <View style={styles.ButtonsView}>
        <TouchableOpacity
          style={[styles.FavButton, isFav && styles.activeFavoriteButton]}
        >
          <AntDesign
            name="hearto"
            size={20}
            color={
              isFav ? AppColors.background.primary : AppColors.text.primary
            }
            fill={isFav ? AppColors.background.primary : "transparent"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.CartButton}
          onPress={() => router.push("/(tabs)/cart")}
        >
          <MaterialCommunityIcons
            name="cart-outline"
            size={20}
            color={AppColors.text.primary}
            fill={isFav ? AppColors.background.primary : "transparent"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommonHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    zIndex: 10,
  },
  BackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  FavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  CartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  ButtonsView: {
    flexDirection: "row",
    gap: 5,
  },
  activeFavoriteButton: {
    backgroundColor: AppColors.error,
  },
});
