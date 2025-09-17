import CustomInput from "@/components/CustomInput";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductCard from "@/components/ProductCard";
import Wrapper from "@/components/Wrapper";
import AppColors from "@/constants/Colors";
import { useProductsStore } from "@/store/productsStore";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef<number | null>(null);
  const {
    products,
    filterdProducts,
    loading,
    error,
    searchProductsRealTime,
    fetchProducts,
  } = useProductsStore();
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearch = (enterdText: string) => {
    setSearchQuery(enterdText);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (searchQuery.length >= 3) {
      searchTimeoutRef.current = setTimeout(() => {
        searchProductsRealTime(enterdText);
      }, 500);
    } else {
      searchProductsRealTime("");
    }
  };
  const handleClearSearch = () => {
    setSearchQuery("");
    searchProductsRealTime("");
  };
  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.title}>Search products</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <View style={styles.inputWrapper}>
              <CustomInput
                value={searchQuery}
                onChangeText={handleSearch}
                placeholder="Search products"
              />
              {searchQuery?.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={handleClearSearch}
                >
                  <AntDesign
                    name="close"
                    size={16}
                    color={AppColors.gray[500]}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <AntDesign name="search" size={24} color={AppColors.primary[500]} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <Wrapper>
      {renderHeader()}

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>ajdkajsdk</Text>
        </View>
      ) : filterdProducts.length === 0 && searchQuery ? (
        <EmptyState
          type="search"
          message="No products found matching your search "
        />
      ) : (
        <FlatList
          data={searchQuery.length >= 3 ? filterdProducts : []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.productContainer}>
                <ProductCard product={item} customStyle={{ width: "100%" }} />
              </View>
            );
          }}
          numColumns={2}
          contentContainerStyle={styles.productsGrid}
          columnWrapperStyle={styles.columnWrapper}
          ListFooterComponent={<View style={styles.footer} />}
          ListEmptyComponent={
            !searchQuery ? (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>
                  Type at least 3 characters to search products
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </Wrapper>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  header: {
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
  },
  searchContainer: {
    flex: 1,
  },
  inputWrapper: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    marginBottom: 0,
    flex: 1,
  },
  searchInputStyle: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: 8,
    borderColor: "transparent",
    paddingRight: 40,
  },
  clearButton: {
    position: "absolute",
    right: 10,
    bottom: 14,
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: AppColors.gray[200],
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  searchButton: {
    backgroundColor: AppColors.primary[100],
    borderRadius: 8,
    width: 49,
    height: 49,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    marginBottom: -25,
  },
  productsGrid: {
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  productContainer: {
    width: "48%",
    marginBottom: 16,
  },
  footer: {
    height: 100,
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: AppColors.error,
    fontSize: 16,
    textAlign: "center",
  },
  emptyStateContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: AppColors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
  },
});
