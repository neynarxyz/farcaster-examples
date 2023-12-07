"use client";

import { ScreenState, useApp } from "@/Context/AppContext";
import Signin from "./Screens/Signin";
import Home from "./Screens/Home";

export default function Index() {
  const { screen } = useApp();

  if (screen === ScreenState.Signin) {
    return <Signin />;
  }

  if (screen === ScreenState.Home) {
    return <Home />;
  }

  return <></>;
}
