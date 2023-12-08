"use client";

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
  useCallback,
} from "react";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";

import useLocalStorage from "@/hooks/use-local-storage-state";
import neynarClient from "@/clients/neynar";
import { isApiErrorResponse } from "@neynar/nodejs-sdk";
import { ErrorRes } from "@neynar/nodejs-sdk/build/neynar-api/v2";

type SetState<T> = Dispatch<SetStateAction<T>>;

export enum ScreenState {
  Signin = "signin",
  Home = "home",
}

interface Props {
  children: ReactNode;
}

interface AppContextInterface {
  screen: ScreenState;
  setScreen: SetState<ScreenState>;
}

const AppContext = createContext<AppContextInterface | null>(null);

export const AppProvider: FC<Props> = ({ children }) => {
  const [screen, setScreen] = useState<ScreenState>(ScreenState.Signin);
  const signerUuid = useSearchParams().get("signer_uuid");
  const fid = useSearchParams().get("fid");

  const [user, setUser, removeUser] = useLocalStorage("user");

  const verifyUser = async (signerUuid: string, fid: string) => {
    let _isVerifiedUser = false;
    try {
      const {
        data: { isVerifiedUser },
      } = await axios.post("/api/verify-user", { signerUuid, fid });
      _isVerifiedUser = isVerifiedUser;
    } catch (err) {
      const { message } = (err as AxiosError).response?.data as ErrorRes;
      toast(message, {
        type: "error",
        theme: "dark",
        autoClose: 3000,
        position: "bottom-right",
        pauseOnHover: true,
      });
    }
    return _isVerifiedUser;
  };

  const isUserLoggedIn = useCallback(async () => {
    // Check if the user is logged in based on the presence of user data in local storage
    const isLoggedIn = !!user;

    console.log("Loggedin user", user);

    // If the user is logged in, show them the home screen
    if (isLoggedIn) {
      setScreen(ScreenState.Home);
    } else {
      // If signer_uuid and fid are present in searchParams, remove them and show the home screen
      if (signerUuid && fid) {
        const verifiedUser = await verifyUser(signerUuid, fid);
        if (!verifiedUser) {
          removeUser();
        } else {
          setUser({ signerUuid, fid });
          // Remove query parameters
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          setScreen(ScreenState.Home);
        }
      } else {
        // If signer_uuid and fid are not present in searchParams, show the signin screen
        setScreen(ScreenState.Signin);
      }
    }
  }, [user, signerUuid, fid, removeUser, setUser]);

  useEffect(() => {
    isUserLoggedIn();
  }, [isUserLoggedIn]);

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
