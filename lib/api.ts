import { Product } from "@/type";
import axios from "axios";

const API_URL = "https://fakestoreapi.com";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Logging out...");
    }
    return Promise.reject(error);
  }
);

export const getProducts = async (): Promise<Product[]> => {
  try {
    const res = await axiosInstance.get("/products");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw new Error("failed to fetch categories");
  }
};
export const getProductById = async (id: string) => {
  try {
    const res = await axiosInstance.get(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch this product:", error);
    throw new Error("failed to fetch this product");
  }
};
export const getCategories = async (): Promise<string[]> => {
  try {
    const res = await axiosInstance.get("/products/categories");
    return res.data;
  } catch (error) {
    console.log("failed to fetch categories", error);
    throw new Error("failed to fetch categories");
  }
};
export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  try {
    const res = await axiosInstance.get(`/products/category/${category}`);
    return res.data;
  } catch (error) {
    console.log(`Failed to fetch products in ${category}`);
    throw error;
  }
};
export const searchProductsApi = async (query: string): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get(`/products`);

    const products = await response.data;
    const searchTerm = query.toLowerCase().trim();

    return products.filter(
      (product: Product) =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error("Failed to search products:", error);
    throw error;
  }
};
export const handlePayment = async (payload: any) => {
  try {
    const res = await axios.post("http://192.168.1.5:8000/checkout", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
