"use client";
import Image from "next/image";
import ScreenLayout from "../layout";
import { getMessage, welcomeMessages } from "@/utils/helpers";
import { useEffect, useState } from "react";

const Signin = () => {
  const [isClient, setIsClient] = useState(false);
  const client_id = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;
  const redirect_uri = process.env.NEXT_PUBLIC_NEYNAR_REDIRECT_URI;

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
          <button
            onClick={() => {
              window.open(
                `https://app.neynar.com/login?client_id=${client_id}&redirect_uri=${redirect_uri}`,
                "_blank"
              );
            }}
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
