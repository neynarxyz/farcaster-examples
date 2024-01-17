// App.tsx
import React, { useEffect, useRef } from "react";
import {
  CommonActions,
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import { AppProvider, useApp } from "./src/Context/AppContext";
import AppNavigator from "./src/AppNavigator";

type RootStackParamList = {
  Home: undefined;
  Signin: undefined;
};

const AuthNavigation: React.FC = () => {
  const { isAuthenticated } = useApp();
  const navigationRef =
    useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigationRef.current?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Home" }],
        })
      );
    } else {
      navigationRef.current?.navigate("Signin");
    }
  }, [isAuthenticated]);

  return (
    <NavigationContainer ref={navigationRef}>
      <AppNavigator />
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AuthNavigation />
    </AppProvider>
  );
};

export default App;
