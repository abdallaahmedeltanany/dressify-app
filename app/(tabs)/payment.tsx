import Button from "@/components/Button";
import StripePayment from "@/components/StripePayment";
import AppColors from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const PaymentScreen = () => {
  const { total, paymentIntent, ephemeralKey, customer, orderId } =
    useLocalSearchParams();
  const router = useRouter();
  const getStringParam = (value: string | string[] | undefined): string =>
    Array.isArray(value) ? value[0] : value || "";
  const { user } = useAuthStore();
  const stripe = StripePayment({
    paymentIntent: getStringParam(paymentIntent),
    ephemeralKey: getStringParam(ephemeralKey),
    customer: getStringParam(customer),
    userEmail: getStringParam(user?.email),
    orderId: getStringParam(orderId),
    onSuccess: () => router.push("/(tabs)/orders"),
  });
  return (
    <View style={styles.container}>
      <View style={styles.paymentContainer}>
        <Text style={styles.title}>Complete your payment</Text>
        <Text style={styles.describtion}>
          Please confirm your payment details to complete the purchase
        </Text>
        <View style={styles.totalContainer}>
          <Text style={styles.text}>total:</Text>
          <Text style={styles.value}> ${Number(total).toFixed(2)}</Text>
        </View>
        <Button
          variant="primary"
          title="Confirm Payment"
          style={{ width: "90%" }}
          onPress={stripe.handlePayment}
        />
        <Button
          variant="outline"
          title="View order"
          style={{ width: "90%" }}
          size="small"
          onPress={() => {
            router.push("/(tabs)/orders");
          }}
        />
      </View>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  paymentContainer: {
    width: "100%",
    height: "40%",
    backgroundColor: AppColors.background.secondary,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
    gap: 20,
    justifyContent: "center",
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 27,
    width: "100%",
    textAlign: "center",
    color: AppColors.text.primary,
  },
  describtion: {
    fontFamily: "Inter-SemiBold",
    textAlign: "center",
    width: "80%",
    color: AppColors.text.tertiary,
  },
  totalContainer: {
    flexDirection: "row",
    backgroundColor: AppColors.primary[100],
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  text: {
    fontFamily: "Inter-SemiBold",
    color: AppColors.text.primary,
  },
  value: {
    color: AppColors.primary[700],
    fontFamily: "Inter-Bold",
    fontSize: 16,
  },
});
