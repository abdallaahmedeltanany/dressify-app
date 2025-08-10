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
