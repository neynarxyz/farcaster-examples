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

  const hasEventListener = useRef(false);
  let authWindow = useRef<Window | null>(null);

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
    if (
      event.origin === "http://localhost:3001" &&
      event.data.isAuthenticated === true
    ) {
      setSignerUuid(event.data.signerUuid);
      setFid(event.data.fid);
      setUser({ signerUuid: event.data.signerUuid, fid: event.data.fid });

      // Close the authentication window if it's still open
      if (authWindow.current) {
        authWindow.current.close();
      }
    }
  };

  const handleOnClick = () => {
    if (!redirect_uri) {
      window.addEventListener("message", handleMessage, false);
      hasEventListener.current = true;
    }

    authWindow.current = window.open(
      `http://localhost:3001/login?client_id=${client_id}` +
        (redirect_uri ? `&redirect_uri=${redirect_uri}` : ""),
      "_blank"
    );
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
