import CartItemCard from "@/components/CartItemCard";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";
import OrderCard from "@/components/OrderCard";
import Wrapper from "@/components/Wrapper";
import AppColors from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Product } from "@/type";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
export interface Order {
  id: number;
  user_email: string;
  created_at: string;
  total_price: string;
  payment_status: string;
  items: Product[];
}
const OrdersScreen = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const handleShowModal = (order: Order) => {
    setShowModal(true);
    setSelectedOrder(order);
  };

  const fetchOrders = async () => {
    if (!user) {
      setError("Please log in to view your orders");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, total_price, payment_status, created_at, items, user_email"
        )
        .eq("user_email", user.email)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch orders: ${error.message}`);
      }
      setOrders(data || []);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      setError(error.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteOrder = async (orderId: number) => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      const { data: order, error: fetchError } = await supabase
        .from("orders")
        .select("id, user_email")
        .eq("id", orderId)
        .single();

      if (fetchError || !order) {
        throw new Error("Order not found");
      }

      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (error) {
        throw new Error(`Failed to delete order:${error?.message}`);
      }
      const filteredOrders = orders.filter((order) => order.id !== orderId);
      setOrders(filteredOrders);
      Toast.show({
        type: "success",
        text1: "Order Deleted",
        text2: `Order #${orderId} has been deleted`,
        position: "bottom",
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      Alert.alert("Error", "Failed to delete order. Please try again.");
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [user]);
  console.log(selectedOrder);
  if (loading) return <LoadingSpinner fullScreen />;
  return (
    <Wrapper>
      <Text style={styles.header}>My orders</Text>

      <Modal isVisible={showModal} style={styles.modalOverlay}>
        <View style={styles.modal}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Order #{selectedOrder?.id} Details</Text>
            <Text style={styles.infoText}>
              Total: {selectedOrder?.total_price}
            </Text>
            <Text style={styles.infoText}>
              Status: {selectedOrder?.payment_status}
            </Text>
            <Text style={styles.infoText}>
              Placed:{" "}
              {new Date(
                selectedOrder?.created_at as string
              ).toLocaleDateString()}
            </Text>
            <Text style={styles.itemsHeader}>Items:</Text>
            <FlatList
              data={selectedOrder?.items}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => {
                return <CartItemCard product={item} />;
              }}
            />
          </View>
        </View>
      </Modal>
      {orders?.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            return (
              <OrderCard
                order={item}
                onDelete={handleDeleteOrder}
                openModal={handleShowModal}
              />
            );
          }}
        />
      ) : (
        <EmptyState
          type="orders"
          actionLabel="Go back"
          onAction={() => {
            router.back();
          }}
        />
      )}
    </Wrapper>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  header: {
    fontFamily: "Inter-Bold",
    fontSize: 30,
    paddingVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "95%",
    backgroundColor: AppColors.primary[100],
    height: "70%",
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: AppColors.text.primary,
  },
  infoText: {
    fontFamily: "Inter-SemiBold",
    paddingVertical: 5,
    color: AppColors.text.secondary,
  },
  itemsHeader: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: AppColors.text.primary,
  },
});
