import { supabase } from "@/lib/supabase";
import { useStripe } from "@stripe/stripe-react-native";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

interface StripeProps {
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
  orderId: string;
  userEmail: string;
  onSuccess?: () => void; // optional callback
}

const StripePayment = ({
  customer,
  ephemeralKey,
  orderId,
  paymentIntent,
  userEmail,
  onSuccess,
}: StripeProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const router = useRouter();
  const returnURL = Linking.createURL("/(tabs)/orders");

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: paymentIntent,
      customerEphemeralKeySecret: ephemeralKey,
      customerId: customer,
      merchantDisplayName: "Dressify",
      returnURL: returnURL,
    });

    if (error) {
      throw new Error(`Init payment sheet failed: ${error.message}`);
    }
  };

  const updatePaymentStatus = async () => {
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: "success" })
      .eq("id", orderId)
      .select();

    if (error) {
      throw new Error(`Failed to update status: ${error.message}`);
    }
  };

  const handlePayment = async () => {
    try {
      await initializePaymentSheet();
      const { error: presentError } = await presentPaymentSheet();
      console.log("presentError", presentError);

      if (presentError) {
        throw new Error(`Payment failed: ${presentError.message}`);
      }

      await updatePaymentStatus();

      Alert.alert("Payment Successful", "Thank you for your purchase!", [
        {
          text: "OK",
          onPress: () => {
            onSuccess?.() || router.push("/(tabs)/orders");
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert("Payment Failed", error.message || "Something went wrong");
    }
  };

  return { handlePayment };
};

export default StripePayment;
