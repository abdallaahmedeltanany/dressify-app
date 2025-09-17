import AppColors from "@/constants/Colors";
import { Product } from "@/type";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

interface CartItemProps {
  product: Product;
  updateQuantity: (productId: number, qunatity: number) => void;
  removeItem: (productId: number) => void;
  quantity: number;
}
const CartItemCard = ({
  product,
  updateQuantity,
  removeItem,
  quantity,
}: CartItemProps) => {
  const Router = useRouter();
  const increaseQuantity = () => {
    updateQuantity(product.id, quantity + 1);
    Toast.show({
      type: "success",
      text1: "Quantity increase successfully",
      visibilityTime: 2000,
    });
  };
  const decreaseQuantity = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
      Toast.show({
        type: "success",
        text1: "Quantity decrease successfully",
        visibilityTime: 2000,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "You can not decreased less than 1",
        visibilityTime: 2000,
      });
    }
  };
  const handleRemove = () => {
    removeItem(product.id);
    Toast.show({
      type: "success",
      text1: "Removed Successfully",
      text2: `${product.title} has been removed from your cart`,
      visibilityTime: 2000,
    });
  };

  return (
    <View style={styles.shadowContainer}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => Router.push(`/product/${product.id}`)}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.imageStyle}
            resizeMode="contain"
          />
        </View>
        <View>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>${product.price}</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={decreaseQuantity}
            >
              <AntDesign
                name="minus"
                size={15}
                color={AppColors.primary[500]}
              />
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={increaseQuantity}
            >
              <AntDesign name="plus" size={15} color={AppColors.primary[500]} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={handleRemove}>
          <AntDesign name="delete" color={AppColors.error} size={18} />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

export default CartItemCard;

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
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: AppColors.text.primary,
    paddingHorizontal: 10,
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
