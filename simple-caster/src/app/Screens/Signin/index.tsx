"use client";
import Image from "next/image";
import ScreenLayout from "../layout";
import { getMessage, welcomeMessages } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { useApp, ScreenState } from "@/Context/AppContext";

const Signin = () => {
  const [isClient, setIsClient] = useState(false);
  const { setScreen } = useApp();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <ScreenLayout>
      <main className="flex-grow flex flex-col items-center justify-center">
        <h2 className="text-4xl font-extralight mb-4">
          {isClient && getMessage(welcomeMessages)}
        </h2>
        <button
          onClick={() => setScreen(ScreenState.Home)}
          className="border flex items-center border-white px-6 py-2 mt-6 rounded"
        >
          <span>
            <Image
              src="/neynar-logo.svg"
              width={50}
              height={50}
              alt="Neynar Logo"
            />
          </span>
          &nbsp;|&nbsp;
          <span className="ml-2 text-lg mr-2">Sign In with Neynar</span>
        </button>
      </main>
    </ScreenLayout>
  );
};

export default Signin;
