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
import axios, { AxiosError } from "axios";

import useLocalStorage from "@/hooks/use-local-storage-state";
import { removeSearchParams, verifyUser } from "@/utils/helpers";
import { UserInfo } from "@/types";
import { toast } from "react-toastify";
import { ErrorRes } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { User } from "@neynar/nodejs-sdk/build/neynar-api/v1";

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
  displayName: string | null;
  setDisplayName: SetState<string | null>;
  pfp: string | null;
  setPfp: SetState<string | null>;
}

const AppContext = createContext<AppContextInterface | null>(null);

export const AppProvider: FC<Props> = ({ children }) => {
  const [screen, setScreen] = useState<ScreenState>(ScreenState.Signin);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [pfp, setPfp] = useState<string | null>(null);

  const signerUuid = useSearchParams().get("signer_uuid");
  const fid = useSearchParams().get("fid");

  const [user, setUser, removeUser] = useLocalStorage<UserInfo | null>(
    "user",
    null
  );

  const lookupUser = useCallback(async () => {
    if (user) {
      try {
        const { data } = await axios.get<{ user: User }>(
          `/api/user/${user.fid}`
        );
        setDisplayName(() => data.user.displayName);
        setPfp(() => data.user.pfp.url);
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
    }
  }, [user]);

  useEffect(() => {
    lookupUser();
  }, [lookupUser]);

  const isUserLoggedIn = useCallback(async () => {
    // Check if the user is logged in based on the presence of user data in local storage
    const isLoggedIn = !!user;

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
          removeSearchParams();
          window.location.reload();
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
      displayName,
      setDisplayName,
      pfp,
      setPfp,
    }),
    [screen, setScreen, displayName, setDisplayName, pfp, setPfp]
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
