"use client";

import useLocalStorage from "@/hooks/use-local-storage-state";
import { useSearchParams } from "next/navigation";
import {
  useContext,
  createContext,
  useMemo,
  useState,
  FC,
  Dispatch,
  SetStateAction,
  ReactNode,
  useEffect,
} from "react";

type SetState<T> = Dispatch<SetStateAction<T>>;

export enum ScreenState {
  Signin = "signin",
  Home = "home",
}

interface Props {
  children: ReactNode;
}

interface AppContextInterface {
  screen: ScreenState | null;
  setScreen: SetState<ScreenState | null>;
}

const AppContext = createContext<AppContextInterface | null>(null);

export const AppProvider: FC<Props> = ({ children }) => {
  const [screen, setScreen] = useState<ScreenState | null>(null);
  const signerUuid = useSearchParams().get("signer_uuid");
  const fid = useSearchParams().get("fid");

  const [user] = useLocalStorage("user");

  useEffect(() => {
    // Check if the user is logged in based on the presence of user data in local storage
    const isLoggedIn = !!user;

    // If the user is logged in, show them the home screen
    if (isLoggedIn) {
      setScreen(ScreenState.Home);
    } else {
      // If signer_uuid and fid are present in searchParams, remove them and show the home screen
      if (signerUuid && fid) {
        // Remove query parameters
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        setScreen(ScreenState.Home);
      } else {
        // If signer_uuid and fid are not present in searchParams, show the signin screen
        setScreen(ScreenState.Signin);
      }
    }
  }, [user, signerUuid, fid]);

  const value: AppContextInterface | null = useMemo(
    () => ({
      screen,
      setScreen,
    }),
    [screen, setScreen]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextInterface => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within AppProvider");
  }
  return context;
};
