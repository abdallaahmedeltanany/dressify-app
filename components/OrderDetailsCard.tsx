import { OrderItems } from "@/app/(tabs)/orders";
import AppColors from "@/constants/Colors";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface OrderItemDetailsProps {
  product: OrderItems;
  quantity: number;
}
const OrderDetailsCard = ({ product, quantity }: OrderItemDetailsProps) => {
  return (
    <View style={styles.shadowContainer}>
      <TouchableOpacity style={styles.cardContent}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.imageStyle}
            resizeMode="contain"
          />
        </View>
        <View style={{ position: "relative" }}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>${product.price}</Text>
          <Text style={styles.quantityValue}>Quantity:{quantity}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default OrderDetailsCard;

const styles = StyleSheet.create({
  shadowContainer: {
    marginTop: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    backgroundColor: AppColors.background.primary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.primary[500],
    paddingVertical: 12,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  imageContainer: {
    width: 90,
    marginRight: 12,
  },
  imageStyle: {
    borderRadius: 6,
    width: "100%",
    height: 80,
  },
  title: {
    fontFamily: "Inter-SemiBold",
    maxWidth: "80%",
    color: AppColors.text.secondary,
    marginBottom: 4,
  },
  price: {
    fontFamily: "Inter-SemiBold",
    color: AppColors.primary[500],
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: AppColors.background.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityValue: {
    fontFamily: "Inter-SemiBold",
    color: AppColors.primary[500],
    fontSize: 16,
  },
  deleteButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    padding: 5,
    backgroundColor: AppColors.gray[100],
    borderRadius: 5,
  },
});
