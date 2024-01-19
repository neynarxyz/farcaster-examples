import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Signin from "./components/Screens/Signin";
import Home from "./components/Screens/Home";
import Loading from "./components/Screens/Loading";

export type RootStackParamList = {
  Home: undefined;
  Signin: undefined;
  Loading: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Loading" component={Loading} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
