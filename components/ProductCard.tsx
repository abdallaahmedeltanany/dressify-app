import AppColors from "@/constants/Colors";
import { useCartStore } from "@/store/cartStore";
import { useFavoriteStore } from "@/store/favoriteStore";
import { Product } from "@/type";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Toast from "react-native-toast-message";
import Button from "./Button";
import Rating from "./Rating";

interface ProductProps {
  product: Product;
  compact?: boolean;
  customStyle?: StyleProp<ViewStyle>;
}
const ProductCard: React.FC<ProductProps> = ({
  product,
  compact = false,
  customStyle,
}) => {
  const { category, id, description, image, price, rating, title } = product;
  const router = useRouter();
  const { addItem } = useCartStore();
  const { isFavorite, toggleFavorite } = useFavoriteStore();

  const isFav = isFavorite(id);

  const handleAddToCart = (e: any) => {
    e.preventDefault();
    addItem(product, 1);
    console.log("added to cart", id);
    Toast.show({
      type: "success",
      text1: "Products is added to cart",
      text2: `${title} is added to your cart successfully `,
      visibilityTime: 2000,
    });
  };
  const handleProductRoute = () => {
    router.push({
      pathname: "/(tabs)/product/[id]",
      params: { id: String(id) },
    });
  };
  const handleToggleFavorite = () => {
    toggleFavorite(product);
  };
  return (
    <TouchableOpacity
      style={[styles.productCard, compact && styles.compactCard, customStyle]}
      onPress={handleProductRoute}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            isFav ? { borderRadius: 1 } : { borderRadius: 0 },
          ]}
          onPress={handleToggleFavorite}
        >
          <AntDesign
            name="heart"
            size={25}
            color={isFav ? AppColors.error : AppColors.gray[300]}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>${price.toFixed(2)} </Text>
          {/* <Text style={styles.ratingText}>
            Rating:
            {rating?.rate}
            <AntDesign
              name="star"
              color={AppColors.accent[500]}
              fill={AppColors.accent[500]}
            />
            / ({rating.count})
          </Text> */}
          <View>
            <Rating rating={rating.rate} count={rating.count} />
          </View>
          {!compact && (
            <Button
              title="Add to cart"
              onPress={handleAddToCart}
              variant="outline"
              size="small"
              style={{ marginTop: 10 }}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: AppColors.background.primary,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
    width: "48%",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.gray[200],
  },
  imageContainer: {
    position: "relative",
    height: 150,
    backgroundColor: AppColors.background.primary,
    padding: 5,
  },
  favoriteButton: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  compactCard: {
    width: 150,
    marginRight: 12,
  },

  content: {
    padding: 12,
    backgroundColor: AppColors.background.secondary,
  },
  title: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    color: AppColors.text.tertiary,
    textTransform: "capitalize",
    marginBottom: 8,
  },
  price: {
    color: AppColors.primary[600],
    fontSize: 16,
    fontWeight: "600",
    // marginBottom: 5,
  },
  ratingText: {
    fontFamily: "Inter-semiBold",
    color: AppColors.gray[500],
    justifyContent: "center",
    alignItems: "center",
  },

  footer: {
    justifyContent: "space-between",
  },
});
