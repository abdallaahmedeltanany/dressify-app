import { Order } from "@/app/(tabs)/orders";
import AppColors from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "./Button";

interface OrderCardProps {
  order: Order;
  onDelete: (orderId: number) => void;
  openModal: (order: Order) => void;
}
const OrderCard = ({ order, onDelete, openModal }: OrderCardProps) => {
  const deleteOrder = () => {
    Alert.alert(
      "Delete Order",
      `Are you sure you want to delete Order #${order?.id}`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(order?.id),
        },
      ]
    );
  };
  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor:
            order.payment_status === "success"
              ? AppColors.primary[100]
              : "#fae4e4",
        },
      ]}
      onPress={() => {
        openModal(order);
      }}
    >
      <Text style={styles.id}>Order #{order.id}</Text>
      <Text style={styles.total}>Total: ${order.total_price}</Text>
      <Text
        style={[
          styles.status,
          {
            color: order.payment_status === "success" ? "#38bc29" : "#ff0a0a",
          },
        ]}
      >
        Status:{order.payment_status}
      </Text>
      <Text style={styles.date}>
        Placed:{new Date(order.created_at).toLocaleDateString()}
      </Text>
      <View style={styles.actionContainer}>
        <Button
          title="View Details"
          onPress={() => openModal(order)}
          style={{ width: "50%" }}
        />
        {order.payment_status === "pending" && (
          <Button
            title="Pay Now"
            variant="secondary"
            onPress={() => {
              console.log("pay now");
            }}
          />
        )}
        <TouchableOpacity style={styles.icon} onPress={deleteOrder}>
          <AntDesign name="delete" color={"red"} size={18} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginBottom: 10,
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
    gap: 5,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  icon: {
    padding: 10,
    backgroundColor: "#f8eded",
    borderRadius: 8,
  },
  id: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: AppColors.text.primary,
  },
  total: {
    fontFamily: "Inter-Regular",
    fontSize: 17,
    color: AppColors.text.primary,
  },
  status: {
    fontFamily: "Inter-SmiBold",
    fontSize: 16,
  },
  date: {
    fontFamily: "Inter-SemiBold",
    color: AppColors.text.secondary,
  },
});
