import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Signin from "./components/Screens/Signin";
import Home from "./components/Screens/Home";

type RootStackParamList = {
  Home: undefined;
  Signin: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
