import { ISuccessMessage } from "@neynar/react-native-signin";
import {
  useContext,
  createContext,
  useMemo,
  useState,
  FC,
  ReactNode,
  useEffect,
} from "react";
import { NEYNAR_API_KEY } from "../../constants";
import { retrieveUser, storeUser } from "../utils";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

interface Props {
  children: ReactNode;
}

interface AppContextInterface {
  displayName: string | null;
  setDisplayName: SetState<string | null>;
  pfp: string | null;
  setPfp: SetState<string | null>;
  signerUuid: string | null;
  setSignerUuid: SetState<string | null>;
  fid: string | null;
  setFid: SetState<string | null>;
  isAuthenticated: boolean | null;
  setIsAuthenticated: SetState<boolean | null>;
  handleSignin: (data: ISuccessMessage) => void;
}

const AppContext = createContext<AppContextInterface | null>(null);

export const AppProvider: FC<Props> = ({ children }) => {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [pfp, setPfp] = useState<string | null>(null);
  const [signerUuid, setSignerUuid] = useState<string | null>(null);
  const [fid, setFid] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const retrieveUserFromStorage = async () => {
    const user = await retrieveUser();
    if (!user) {
      setIsAuthenticated(false);
      return;
    }
    await fetchUserAndSetUser(parseInt(user.fid));
    setSignerUuid(user.signer_uuid);
    setFid(user.fid);
    setIsAuthenticated(user.is_authenticated);
  };

  useEffect(() => {
    retrieveUserFromStorage();
  }, []);

  const fetchUserAndSetUser = async (fid: number) => {
    try {
      const response = await fetch(
        `https://api.neynar.com/v1/farcaster/user?fid=${fid}&api_key=${NEYNAR_API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      const {
        result: {
          user: {
            displayName,
            pfp: { url },
          },
        },
      } = await response.json();
      setDisplayName(displayName);
      setPfp(url);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignin = async (data: ISuccessMessage) => {
    storeUser(data);
    await fetchUserAndSetUser(parseInt(data.fid));
    setIsAuthenticated(data.is_authenticated);
    setFid(data.fid);
    setSignerUuid(data.signer_uuid);
  };

  const value: AppContextInterface | null = useMemo(
    () => ({
      displayName,
      setDisplayName,
      pfp,
      setPfp,
      signerUuid,
      setSignerUuid,
      fid,
      setFid,
      isAuthenticated,
      setIsAuthenticated,
      handleSignin,
    }),
    [displayName, pfp, signerUuid, fid, isAuthenticated]
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
