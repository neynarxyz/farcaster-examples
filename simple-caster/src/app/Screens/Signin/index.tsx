"use client";
import Image from "next/image";
import ScreenLayout from "../layout";
import { getMessage, welcomeMessages } from "@/utils/helpers";
import { useEffect, useState } from "react";

const Signin = () => {
  const [isClient, setIsClient] = useState(false);

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
                "https://app.neynar.com/login?client_id=a1092b41-629f-45e0-b196-b3ff3a8f193f&redirect_uri=https://demo.neynar.com",
                "_blank"
              );
            }}
            className="border flex items-center border-white px-6 py-2 mt-6 rounded-3xl"
          >
            <span>
              <Image
                src="/logos/neynar.svg"
                width={48}
                height={48}
                alt="Neynar Logo"
              />
            </span>
            <span className="ml-2 text-lg mr-2">Sign In with Neynar</span>
          </button>
        </div>
      </main>
    </ScreenLayout>
  );
};

export default Signin;
