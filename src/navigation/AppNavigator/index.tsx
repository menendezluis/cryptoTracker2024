// AppNavigator.tsx
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Home from "../../screens/Home";
import News from "../../screens/News";
import Actions from "../../screens/Actions";
import Prices from "../../screens/Prices";
import Login from "../../screens/Login";

import TabBar from "../../components/TabBar";
import { AuthContext } from "../../auth/AuthContext";

const HomeStackNavigator = createNativeStackNavigator();

// Header component shared across all screens in HomeNavigator
const HeaderRight = ({
  logout,
  user,
}: {
  logout: () => void;
  user: { name: string; id: string };
}) => {
  const getInitials = (user: { name: string; id: string }) => {
    if (!user.name) return "";
    if (user.id === "Guest") return user.name.charAt(0).toUpperCase();
    const [firstName, lastName] = user.name.split(" ");
    return (firstName?.[0] || "") + (lastName?.[0] || "");
  };

  return (
    <TouchableOpacity
      style={styles.headerRightContainer}
      onPress={() => {
        alert("Logging out...");
        logout();
      }}
    >
      <Text style={styles.userName}>{user?.name}</Text>
      <Text style={styles.userName}>
        {user?.id === "Guest" ? " (Guest)" : ""}
      </Text>

      <Image
        source={{
          uri: `https://dummyjson.com/image/40x40/008080/ffffff?text=${getInitials(
            user
          )}`,
        }}
        style={styles.avatar}
      />
    </TouchableOpacity>
  );
};

// Home Stack Navigator
const HomeNavigator = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <HomeStackNavigator.Navigator
      screenOptions={{
        headerRight: () => <HeaderRight logout={logout} user={user} />,
      }}
    >
      <HomeStackNavigator.Screen
        name="Home"
        component={Home}
        options={{ title: "Home" }}
      />
      <HomeStackNavigator.Screen
        name="News"
        component={News}
        options={{ title: "News" }}
      />
      <HomeStackNavigator.Screen
        name="Actions"
        component={Actions}
        options={{ title: "Actions" }}
      />
      <HomeStackNavigator.Screen
        name="Crypto Coin Prices"
        component={Prices}
        options={{ title: "Prices" }}
      />
    </HomeStackNavigator.Navigator>
  );
};

const TabBarNavigator = createBottomTabNavigator();

const TabNavigator = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <TabBarNavigator.Navigator tabBar={(props) => <TabBar {...props} />}>
      <TabBarNavigator.Screen
        name="Home"
        component={HomeNavigator}
        options={{ headerShown: false }} // Stack manages its own headers
      />
      <TabBarNavigator.Screen
        name="Actions"
        component={Actions}
        options={{ headerShown: true }} // Optional, handled in stack
      />
      <TabBarNavigator.Screen
        name="Prices"
        component={Prices}
        options={{ headerShown: true }} // Optional, handled in stack
      />
    </TabBarNavigator.Navigator>
  );
};

const AppNavigator = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <TabNavigator isLoggedIn={isLoggedIn} />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginLeft: 8,
  },
  userName: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    maxWidth: 80,
  },
});

export default AppNavigator;
