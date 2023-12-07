import { ScreenState, useApp } from "@/Context/AppContext";
import Image from "next/image";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const ScreenLayout = ({ children }: Props) => {
  const { screen } = useApp();

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="flex justify-between items-center p-5">
        <div className="flex items-center">
          <Image
            src="/simple-caster-logo.png"
            width={40}
            height={40}
            alt="SimpleCaster Logo"
          />
          <h1 className="text-xl font-extralight font-bold ml-3">
            SimpleCaster
          </h1>
        </div>
        {screen !== ScreenState.Signin && (
          <div className="flex items-center">
            <span className="mr-2">
              <Image
                src="https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_jpg,w_168/https%3A%2F%2Fi.imgur.com%2FLPzRlQl.jpg"
                width={40}
                height={40}
                alt="User Profile Picture"
                className="rounded-full"
              />
            </span>
            <span>UserName</span>
          </div>
        )}
      </header>
      {children}
      <footer className="text-center p-4">Powered by Neynar</footer>
    </div>
  );
};

export default ScreenLayout;
