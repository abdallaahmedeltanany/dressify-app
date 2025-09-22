import Button from "@/components/Button";
import Wrapper from "@/components/Wrapper";
import AppColors from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import {
  Feather,
  FontAwesome5,
  Foundation,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const ProfileScreen = () => {
  const { checkSession, error, login, isLoading, logout, signup, user } =
    useAuthStore();
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      checkSession();
    }
  }, [user]);

  const menuItems = [
    {
      id: "cart",
      icon: (
        <Foundation
          name="shopping-cart"
          size={20}
          color={AppColors.primary[500]}
        />
      ),
      title: "My Cart",
      onPress: () => {
        router.push("/(tabs)/cart");
      },
    },
    {
      id: "orders",
      icon: (
        <FontAwesome5
          name="box-open"
          size={16}
          color={AppColors.primary[500]}
        />
      ),
      title: "My Orders",
      onPress: () => {
        router.push("/(tabs)/orders");
      },
    },
  ];

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await logout();
            Toast.show({
              type: "success",
              text1: "Log out successful",
              text2: "You have been logged out",
              visibilityTime: 2000,
            });
          } catch (error) {
            console.error("Profile: Error during logout:", error);
            Alert.alert("Logout Error", "An unexpected error occurred");
          }
        },
      },
    ]);
  };
  return (
    <Wrapper>
      {user ? (
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>ProfileScreen</Text>
          </View>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Feather name="user" color={AppColors.gray[400]} size={40} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileEmail}>{user.email}</Text>
              <TouchableOpacity style={styles.pressableContainer}>
                <Text style={styles.pressableText}>Edit profile</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.menuContainer}>
            <FlatList
              data={menuItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={item.onPress}
                  >
                    <View style={styles.menuItemLeft}>
                      {item.icon}
                      <Text style={styles.menuItemText}>{item.title}</Text>
                    </View>
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color={AppColors.gray[400]}
                    />
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          <Button
            title="Logout"
            variant="outline"
            fullWidth
            style={styles.logOutButton}
            textStyle={styles.logoutText}
            loading={isLoading}
            onPress={handleLogout}
            disabled={isLoading}
            loadingSpinner={AppColors.error}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.message}>
            Please login or signup to access your profile and enjoy all
            features.
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              title="Log in"
              fullWidth
              size="small"
              onPress={() => {
                router.push("/(tabs)/login");
              }}
            />
            <Button
              title="Sign up"
              variant="outline"
              size="small"
              onPress={() => {
                router.push("/(tabs)/signup");
              }}
            />
          </View>
        </View>
      )}
    </Wrapper>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColors.background.primary,
  },
  header: {
    paddingBottom: 16,
    backgroundColor: AppColors.background.primary,
    marginTop: Platform.OS === "android" ? 30 : 0,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: AppColors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
  },
  avatarContainer: {
    width: 60,
    height: 60,
    backgroundColor: AppColors.gray[200],
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
    gap: 5,
  },
  pressableContainer: {
    backgroundColor: AppColors.primary[200],
    width: 100,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  pressableText: {
    fontFamily: "Inter-Bold",
    color: AppColors.primary[700],
  },
  profileEmail: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: AppColors.text.primary,
  },
  menuContainer: {
    marginTop: 16,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: AppColors.background.primary,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
    alignItems: "center",
  },
  menuItemLeft: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  menuItemText: {
    fontFamily: "Inter-Medium",
  },
  logOutButton: {
    marginTop: 30,
    borderColor: AppColors.error,
    borderWidth: 2,
  },
  logoutText: {
    color: AppColors.error,
    fontSize: 16,
  },

  title: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: AppColors.text.primary,
  },
  message: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: AppColors.text.secondary,
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
});
