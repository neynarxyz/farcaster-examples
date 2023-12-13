import ScreenLayout from "../layout";
import { getMessage, welcomeMessages } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { useApp } from "@/Context/AppContext";
import useLocalStorage from "@/hooks/use-local-storage-state";

function useDynamicScript(url: string) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url]);
}

const Signin = () => {
  useDynamicScript("https://shreyaschorge.github.io/nsi/client.js");
  const [_, setUser] = useLocalStorage("user");
  const [isClient, setIsClient] = useState(false);
  const { setSignerUuid, setFid } = useApp();
  const client_id = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;
  const redirect_uri = process.env.NEXT_PUBLIC_NEYNAR_REDIRECT_URI;
  const neynar_login_url = process.env.NEXT_PUBLIC_NEYNAR_LOGIN_URL;

  if (!neynar_login_url) {
    throw new Error("NEXT_PUBLIC_NEYNAR_LOGIN_URL is not defined in .env");
  }
  if (!client_id) {
    throw new Error("NEXT_PUBLIC_NEYNAR_CLIENT_ID is not defined in .env");
  }

  useEffect(() => {
    window.onSignInSuccess = (data) => {
      console.log("onSignInSuccess", data);
      setUser(data);
      setSignerUuid(data.signer_uuid);
      setFid(data.fid);
    };

    return () => {
      delete window.onSignInSuccess; // Clean up the global callback
    };
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <ScreenLayout>
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="mx-5 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-extralight mb-4">
            {isClient && getMessage(welcomeMessages)}
          </h2>
          <div
            className="neynar_signin mt-6"
            data-client_id={client_id}
            data-neynar_login_url={neynar_login_url}
            data-success-callback="onSignInSuccess"
            data-theme="light"
          ></div>
        </div>
      </main>
    </ScreenLayout>
  );
};

export default Signin;
