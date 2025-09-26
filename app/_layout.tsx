import { StripeProvider } from "@stripe/stripe-react-native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Platform, StatusBar } from "react-native";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const publishableKey =
    "pk_test_51S6bzpDX6UXG9xjC7fU6e7981g4RDMFQp4D0oLEkLffrCWZyaULDgPjjsQ1ujuNjPOsdzzQu0oaFdVhha3Y7mMuk00bi5cL8ah";

  if (!loaded) {
    return null;
  }

  return (
    <StripeProvider publishableKey={publishableKey}>
      <Stack>
        <Stack.Screen name="(splash)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast />
      <StatusBar
        barStyle={Platform.OS === "android" ? "default" : "dark-content"}
      />
    </StripeProvider>
  );
}
