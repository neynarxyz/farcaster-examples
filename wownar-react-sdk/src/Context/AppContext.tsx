"use client";

import {
  useContext,
  createContext,
  useMemo,
  useState,
  FC,
  ReactNode,
} from "react";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

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

  const value: AppContextInterface | null = useMemo(
    () => ({
      screen,
      setScreen,
    }),
    [screen]
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
