"use client";

import { ScreenState, useApp } from "@/Context/AppContext";
import { NeynarAuthButton, useNeynarContext } from "@neynar/react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect } from "react";

interface Props {
  children: ReactNode;
}

const ScreenLayout = ({ children }: Props) => {
  const { setScreen } = useApp();
  const { isAuthenticated } = useNeynarContext();

  useEffect(() => {
    if (isAuthenticated) {
      setScreen(ScreenState.Home);
    } else {
      setScreen(ScreenState.Signin);
    }
  }, [isAuthenticated, setScreen]);

  return (
    <div className="flex flex-col min-h-screen text-white">
      <header className="flex justify-between items-center p-5">
        <div className="flex items-center">
          <Image
            src="/logos/wownar.svg"
            width={60}
            height={60}
            alt="SimpleCaster Logo"
          />
          <h1 className="text-xl font-extralight font-bold ml-3">Wownar</h1>
        </div>
        {isAuthenticated && <NeynarAuthButton />}
      </header>
      {children}
      <footer className="flex flex-col justify-center items-center gap-y-6 text-center p-4">
        {/* <Link
          href="https://docs.neynar.com/docs/how-to-let-users-connect-farcaster-accounts-with-write-access-for-free-using-sign-in-with-neynar-siwn"
          target="_blank"
        >
          Connect Farcaster accounts for free using&nbsp;
          <span className="font-bold">Sign in with Neynar</span>
        </Link> */}
        <Link
          href="https://github.com/neynarxyz/farcaster-examples/tree/main/wownar-react-sdk"
          target="_blank"
        >
          Github Repo -&gt; <span className="font-bold">Wownar</span>
        </Link>
      </footer>
    </div>
  );
};

export default ScreenLayout;
