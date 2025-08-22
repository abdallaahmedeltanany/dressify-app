import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductCard from "@/components/ProductCard";
import Wrapper from "@/components/Wrapper";
import AppColors from "@/constants/Colors";
import { useProductsStore } from "@/store/productsStore";
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ShopScreen = () => {
  const { category } = useLocalSearchParams<{ category: string }>();
  const {
    categories,
    error,
    fetchCategories,
    fetchProducts,
    filterdProducts,
    loading,
    searchProductsRealTime,
    selectedCategory,
    setCategory,
    sortProducts,
    products,
  } = useProductsStore();
  const [showSortModal, setShowSortModal] = useState(false);
  const [activeSortOption, setActiveSortOption] = useState<string | null>(null);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [allCategories, setAllCategories] = useState<string[]>([]);

  const router = useRouter();
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    if (category) {
      setCategory(category);
    }
  }, [category]);

  const handleSort = (sortBy: "price-asc" | "price-desc" | "rating") => {
    setActiveSortOption(sortBy);
    sortProducts(sortBy);
    setShowSortModal(false);
    setIsFilterActive(true);
  };
  const resetFilter = () => {
    setActiveSortOption(null);
    setShowSortModal(false);
    setIsFilterActive(false);
    sortProducts("price-asc");
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.title}>All products</Text>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.searchRow}
            onPress={() => router.push("/(tabs)/search")}
          >
            <View style={styles.searchContainer}>
              <View style={styles.searchInput}>
                <Text>search inputs</Text>
              </View>
            </View>
            <View style={styles.searchButton}>
              <AntDesign name="search1" size={24} color="white" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              isFilterActive && styles.activeSortButton,
            ]}
            onPress={() => setShowSortModal(true)}
          >
            <AntDesign name="filter" size={20} color={AppColors.text.primary} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === null && styles.selectedCategory,
            ]}
            onPress={() => setCategory(null)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === null && styles.selectedCategoryText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {categories?.map((category, id) => {
            return (
              <TouchableOpacity
                key={id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategory,
                ]}
                onPress={() => setCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category &&
                      styles.selectedCategoryText,
                  ]}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  if (error) {
    return (
      <Wrapper>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      {renderHeader()}
      {loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <LoadingSpinner fullScreen />
        </View>
      ) : filterdProducts?.length === 0 ? (
        <EmptyState
          type="search"
          message="No products found matching your criteria"
        />
      ) : (
        <FlatList
          data={filterdProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.productContainer}>
              <ProductCard product={item} customStyle={{ width: "100%" }} />
            </View>
          )}
          contentContainerStyle={styles.productsGrid}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<View style={styles.footer} />}
        />
      )}
      <Modal
        visible={showSortModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort by</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <AntDesign
                  name="close"
                  size={24}
                  color={AppColors.text.primary}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.sortOption}
              onPress={() => handleSort("price-asc")}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  activeSortOption === "price-asc" && styles.activeSortText,
                ]}
              >
                price:low to high
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sortOption}
              onPress={() => handleSort("price-desc")}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  activeSortOption === "price-desc" && styles.activeSortText,
                ]}
              >
                price:high to low
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sortOption}
              onPress={() => handleSort("rating")}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  activeSortOption === "price-rating" && styles.activeSortText,
                ]}
              >
                highest rated
              </Text>
            </TouchableOpacity>

            {isFilterActive && (
              <TouchableOpacity
                style={styles.sortOption}
                onPress={() => resetFilter()}
              >
                <Text
                  style={[styles.sortOptionText, { color: AppColors.error }]}
                >
                  Reset filter
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </Wrapper>
  );
};

export default ShopScreen;

const styles = StyleSheet.create({
  header: {
    marginTop: Platform.OS === "android" ? 30 : 0,
    paddingBottom: 16,
    backgroundColor: AppColors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: AppColors.text.primary,
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
    flex: 1,
    marginRight: 5,
  },
  searchContainer: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: AppColors.gray[300],
    color: AppColors.text.primary,
  },
  searchInputStyle: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: 8,
    borderColor: "transparent",
  },
  searchButton: {
    backgroundColor: AppColors.primary[500],
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    position: "absolute",
    right: 0,
  },
  sortButton: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: 8,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  activeSortButton: {
    borderWidth: 1,
    borderColor: AppColors.error,
  },
  activeSortText: {
    color: AppColors.primary[600],
    fontWeight: "bold",
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: AppColors.background.secondary,
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: AppColors.primary[500],
  },
  categoryText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: AppColors.text.primary,
  },
  selectedCategoryText: {
    color: AppColors.background.primary,
  },
  productsGrid: {
    paddingHorizontal: 5,
    paddingTop: 16,
    paddingBottom: 50,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  productContainer: {
    width: "48%",
  },
  footer: {
    height: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: AppColors.background.primary,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: AppColors.text.primary,
  },
  sortOptionView: {
    borderWidth: 1,
    borderColor: AppColors.gray[200],
    width: 45,
    height: 45,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sortOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
  },
  activeSortOption: {
    backgroundColor: AppColors.background.secondary,
  },
  sortOptionText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: AppColors.text.primary,
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
