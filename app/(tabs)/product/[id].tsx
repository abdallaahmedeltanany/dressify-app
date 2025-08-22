import CommonHeader from "@/components/CommonHeader";
import Rating from "@/components/Rating";
import AppColors from "@/constants/Colors";
import { getProductById } from "@/lib/api";
import { Product } from "@/type";
import { useLocalSearchParams } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const ProductScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product>();
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();
  const [quantity, setQuantity] = useState<number>(1);

  useLayoutEffect(() => {
    const fetchProductById = async () => {
      setIsLoading(true);
      try {
        const fetchedProduct = await getProductById(id);
        setProduct(fetchedProduct);
      } catch (error: any) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductById();
  }, [id]);

  return (
    <>
      <View
        style={{
          paddingTop: 30,
          position: "relative",
          backgroundColor: AppColors.background.primary,
        }}
      >
        <CommonHeader />
      </View>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product?.image }}
            style={styles.productImage}
            resizeMode="center"
          />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.category}>{product?.category}</Text>
          <Text style={styles.title}>{product?.title}</Text>
          <View style={styles.ratingContainer}>
            <Rating
              rating={product?.rating?.rate ?? 0}
              count={product?.rating?.count}
            />
          </View>
          <Text style={styles.price}>${product?.price.toFixed(2)}</Text>
          <View style={styles.divider} />
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{product?.description}</Text>
        </View>
        <View style={styles.divider} />
      </ScrollView>
    </>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },

  imageContainer: {
    width: width,
    height: width,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppColors.background.primary,
  },
  productImage: {
    width: "80%",
    height: "80%",
  },
  productInfo: {
    paddingHorizontal: 24,
    paddingBottom: 120,
    paddingTop: 10,
    backgroundColor: AppColors.background.secondary,
  },
  category: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: AppColors.text.secondary,
    marginBottom: 8,
    textTransform: "capitalize",
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: AppColors.text.primary,
    marginBottom: 8,
  },
  ratingContainer: {
    marginBottom: 16,
  },
  price: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: AppColors.primary[600],
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray[200],
    // marginVertical: 16,
    marginBottom: 16,
  },
  descriptionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: AppColors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: AppColors.text.secondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  quantityTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: AppColors.text.primary,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.background.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityValue: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: AppColors.text.primary,
    paddingHorizontal: 16,
  },
  footer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    backgroundColor: AppColors.background.primary,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray[200],
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalPrice: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: AppColors.text.primary,
  },
  addToCartButton: {
    width: "60%",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: AppColors.error,
    textAlign: "center",
    marginBottom: 16,
  },
  errorButton: {
    marginTop: 8,
  },
});
