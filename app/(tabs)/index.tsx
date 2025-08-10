import HomeHeader from "@/components/HomeHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductCard from "@/components/ProductCard";
import AppColors from "@/constants/Colors";
import { useProductsStore } from "@/store/productsStore";
import { Product } from "@/type";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const {
    categories,
    error,
    fetchCategories,
    fetchProducts,
    filterdProducts,
    loading,
    products,
  } = useProductsStore();
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);
  useEffect(() => {
    if (products.length > 0) {
      setFeaturedProducts([...products.reverse()]);
    }
  }, [products]);
  if (loading) return <LoadingSpinner size="large" fullScreen={true} />;
  if (error)
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error:{error}</Text>
        </View>
      </SafeAreaView>
    );
  return (
    <View style={styles.wrapper}>
      <HomeHeader />
      <View style={styles.contentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainerView}
        >
          <View style={styles.categoriesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories?.map((category, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.categoryButton}
                    onPress={() =>
                      router.push({
                        pathname: "/(tabs)/shop",
                        params: { category: category },
                      })
                    }
                  >
                    <AntDesign
                      name="tag"
                      size={16}
                      color={AppColors.primary[700]}
                    />
                    <Text style={styles.categoryText}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Products</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={featuredProducts}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredProductsContainer}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                return (
                  <View style={styles.featuredSection}>
                    <ProductCard product={item} compact />
                  </View>
                );
              }}
            />
          </View>
          <View style={styles.newestSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Newest Arrival</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.productsGrid}>
              {products.reverse().map((product) => {
                return (
                  <View key={product.id} style={styles.productContainer}>
                    <ProductCard
                      product={product}
                      customStyle={{ width: "100%" }}
                    />
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: AppColors.background.primary,
  },
  contentContainer: {
    paddingLeft: 20,
  },
  scrollContainerView: {
    paddingBottom: 300,
  },
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 28,
    color: "white",
    marginBottom: 24,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingRight: 20,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: AppColors.text.primary,
  },
  seeAllText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: AppColors.primary[500],
  },
  categoriesSection: {
    marginTop: 10,
    marginBottom: 16,
  },

  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.background.secondary,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 15,
    minWidth: 100,
    marginLeft: 5,
  },
  categoryText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: AppColors.text.primary,
    marginLeft: 8,
  },
  featuredSection: {
    marginVertical: 16,
  },
  featuredProductsContainer: {},
  featuredProductContainer: {
    // marginHorizontal: 8,
  },
  newestSection: {
    marginVertical: 16,
    marginBottom: 32,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingRight: 20,
  },
  productContainer: {
    width: "48%",
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
  },
});
