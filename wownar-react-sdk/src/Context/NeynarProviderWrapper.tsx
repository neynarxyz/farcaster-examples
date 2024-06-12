"use client";

import { FC, ReactNode } from "react";
import { ScreenState, useApp } from "./AppContext";
import { NeynarContextProvider, Theme } from "@neynar/react";

interface Props {
  children: ReactNode;
}

const NeynarProviderWrapper: FC<Props> = ({ children }) => {
  const { setScreen } = useApp();

  return (
    <NeynarContextProvider
      settings={{
        clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || "",
        defaultTheme: Theme.Dark,
        eventsCallbacks: {
          onAuthSuccess: () => {
            setScreen(ScreenState.Home);
          },
          onSignout() {
            setScreen(ScreenState.Signin);
          },
        },
      }}
    >
      {children}
    </NeynarContextProvider>
  );
};

export default NeynarProviderWrapper;
