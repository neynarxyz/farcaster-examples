import Image from "next/image";
import ScreenLayout from "../layout";
import { getMessage, welcomeMessages } from "@/utils/helpers";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/Context/AppContext";
import useLocalStorage from "@/hooks/use-local-storage-state";

const Signin = () => {
  const [_, setUser] = useLocalStorage("user");
  const [isClient, setIsClient] = useState(false);
  const { setSignerUuid, setFid } = useApp();
  const client_id = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;
  const redirect_uri = process.env.NEXT_PUBLIC_NEYNAR_REDIRECT_URI;
  const neynar_login_url = process.env.NEXT_PUBLIC_NEYNAR_LOGIN_URL;

  const hasEventListener = useRef(false);
  let authWindow = useRef<Window | null>(null);

  if (!neynar_login_url) {
    throw new Error("NEXT_PUBLIC_NEYNAR_LOGIN_URL is not defined in .env");
  }
  if (!client_id) {
    throw new Error("NEXT_PUBLIC_NEYNAR_CLIENT_ID is not defined in .env");
  }

  useEffect(() => {
    setIsClient(true);

    // Cleanup function to remove event listener when component unmounts
    return () => {
      if (hasEventListener.current) {
        window.removeEventListener("message", handleMessage);
      }
    };
  }, []);

  const handleMessage = (event: MessageEvent) => {
    const auth_origin = new URL(neynar_login_url).origin;
    if (
      event.origin === auth_origin &&
      event.data.is_authenticated === true
    ) {
      setSignerUuid(event.data.signer_uuid);
      setFid(event.data.fid);
      setUser({ signerUuid: event.data.signer_uuid, fid: event.data.fid });

      // Close the authentication window if it's still open
      if (authWindow.current) {
        authWindow.current.close();
      }
    }
  };

  function constructUrl(baseUrl: string | URL, queryParamsObj: { [x: string]: any; }) {
    // Create a URL object with the base URL
    const url = new URL(baseUrl);
  
    // Loop through the query parameters object and append them to the URL
    for (const key in queryParamsObj) {
      url.searchParams.append(key, queryParamsObj[key]);
    }
  
    // Get the final URL as a string
    return url.toString();
  }

  const handleOnClick = () => {    
    if (!redirect_uri) {
      window.addEventListener("message", handleMessage, false);
      hasEventListener.current = true;
    }

    let query_params = {};
    if (neynar_login_url) {
      // Use the window.postMessage approach
      query_params = { client_id: client_id };
    // } else {
    //   // Uses the redirect_uri approach
    //   query_params = { client_id: client_id, redirect_uri: redirect_uri };
    }
    const auth_url = constructUrl(neynar_login_url, query_params);
    authWindow.current = window.open(auth_url, "_blank");
  };

  return (
    <ScreenLayout>
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="mx-5 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-extralight mb-4">
            {isClient && getMessage(welcomeMessages)}
          </h2>
          <button
            onClick={handleOnClick}
            className="border flex items-center border-white px-6 py-2 mt-6 rounded"
          >
            <span>
              <Image
                src="/logos/neynar.svg"
                width={50}
                height={50}
                alt="Neynar Logo"
              />
            </span>
            &nbsp;|&nbsp;
            <span className="ml-2 text-lg mr-2">Sign In with Neynar</span>
          </button>
        </div>
      </main>
    </ScreenLayout>
  );
};

export default Signin;
