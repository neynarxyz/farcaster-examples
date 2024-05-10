import ScreenLayout from "../layout";
import { NeynarAuthButton } from "@neynar/react";

const Signin = () => {
  return (
    <ScreenLayout>
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="mx-5 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-extralight mb-4">Wowow Farcaster</h2>
        </div>
        <NeynarAuthButton />
      </main>
    </ScreenLayout>
  );
};

export default Signin;
