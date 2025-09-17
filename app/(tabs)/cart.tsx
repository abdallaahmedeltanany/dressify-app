import Button from "@/components/Button";
import CartItemCard from "@/components/CartItemCard";
import EmptyState from "@/components/EmptyState";
import HomeHeader from "@/components/HomeHeader";
import Wrapper from "@/components/Wrapper";
import AppColors from "@/constants/Colors";
import { handlePayment } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const CartScreen = () => {
  const [loading, setLoading] = useState(false);
  const Router = useRouter();
  const { items, clearCart, removeItem, updateQuantity, getTotalPrice } =
    useCartStore();
  const { user } = useAuthStore();
  const subTotal = getTotalPrice();
  const shippingCost = subTotal > 50 ? 5.99 : 0;
  const total = subTotal + shippingCost;

  const handlePaymentRouter = async () => {
    try {
      setLoading(true);
      const orderData = {
        user_email: user?.email,
        total_price: total,
        items: items.map((item) => ({
          product_id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        payment_status: "pending",
      };
      const { data, error } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (error) {
        throw new Error(`failed to save order${error.message}`);
      }
      const payload = {
        email: user?.email,
        price: total,
      };
      const response = await handlePayment(payload);
      const { paymentIntent, ephemeralKey, customer } = response;
      console.log(paymentIntent);
      console.log(ephemeralKey);
      console.log(customer);

      setLoading(false);

      if (!paymentIntent || !ephemeralKey || !customer) {
        throw new Error("missing requierd stripe data ");
      } else {
        Toast.show({
          type: "success",
          text1: "Order Placed",
          text2: "Order Placed Succesfully",
          position: "bottom",
          visibilityTime: 2000,
        });
        Router.push({
          pathname: "/(tabs)/payment",
          params: {
            total: total,
            paymentIntent,
            ephemeralKey,
            customer,
            orderId: data.id,
          },
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Order Failed",
        text2: "Failed to place order",
        position: "bottom",
        visibilityTime: 2000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <HomeHeader />
      <Wrapper>
        {items.length > 0 ? (
          <>
            <View style={styles.headerView}>
              <View>
                <Text style={styles.title}>Cart items</Text>
                <Text style={styles.count}>{items.length} items</Text>
              </View>
              <View>
                <TouchableOpacity onPress={clearCart}>
                  <Text style={styles.clearButton}>clear</Text>
                </TouchableOpacity>
              </View>
            </View>
            <FlatList
              data={items}
              keyExtractor={(item) => item.product.id.toString()}
              renderItem={({ item }) => {
                return (
                  <CartItemCard
                    product={item.product}
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                    quantity={item.quantity}
                  />
                );
              }}
              showsHorizontalScrollIndicator={false}
            />
            <View style={styles.divider} />

            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.text}>Subtotal</Text>
                <Text style={styles.value}>${subTotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.text}>Shipping</Text>
                <Text>${shippingCost}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.total}>Total</Text>
                <Text style={styles.totalPrice}>${total.toFixed(2)}</Text>
              </View>
              <Button
                title="Place order"
                onPress={handlePaymentRouter}
                disabled={!user || loading}
              />
            </View>
          </>
        ) : (
          <EmptyState
            type="cart"
            onAction={() => Router.back()}
            actionLabel="Go back"
          />
        )}
      </Wrapper>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[300],
    paddingBottom: 10,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: AppColors.text.primary,
    paddingBottom: 5,
  },
  count: {
    fontFamily: "Inter-Regular",
    color: AppColors.text.secondary,
  },
  clearButton: {
    fontFamily: "Inter-Regular",
    color: AppColors.error,
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray[200],
    marginVertical: 16,
    marginBottom: 16,
  },
  footer: {
    height: 100,
  },
  summaryContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    marginBottom: 50,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 7,
  },
  text: {
    fontFamily: "Inter-SemiBold",
    color: AppColors.gray[400],
  },
  value: {
    color: AppColors.text.primary,
  },
  total: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
  },
  totalPrice: {
    fontFamily: "Inter-Bold",
    color: AppColors.primary[500],
    fontSize: 18,
  },
});
