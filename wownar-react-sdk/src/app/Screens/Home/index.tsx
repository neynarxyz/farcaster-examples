import Image from "next/image";
import ScreenLayout from "../layout";
import styles from "./index.module.scss";
import Button from "@/components/Button";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { ErrorRes } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { useState } from "react";
import { NeynarFrameCard, NeynarProfileCard, useNeynarContext } from "@neynar/react";

export enum ToastType {
  Success = "success",
  Error = "error",
  Warning = "warning",
  Info = "info",
}

const NEYNAR_API_URL = "https://sdk-api.neynar.com";

export type NeynarFrame = {
  version: string;
  title: string;
  image: string;
  buttons: {
    index: number;
    title: string;
    action_type: string;
    target?: string;
    post_url?: string;
  }[];
  input: {
    text?: string;
  };
  state: object;
  frames_url: string;
};

const Home = () => {
  const { user, client_id, showToast } = useNeynarContext();
  const [text, setText] = useState("");
  const [signerValue, setSignerValue] = useState<string | null>(user?.signer_uuid || null);

  async function handlePublishCast() {
    try {
      const {
        data: { message },
      } = await axios.post<{ message: string }>("/api/cast", {
        signerUuid: user?.signer_uuid,
        text,
      });
      toast(message, {
        type: "success",
        theme: "dark",
        autoClose: 3000,
        position: "bottom-right",
        pauseOnHover: true,
      });
      setText("");
    } catch (err) {
      const { message } = (err as AxiosError).response?.data as ErrorRes;
      toast(message, {
        type: "error",
        theme: "dark",
        autoClose: 3000,
        position: "bottom-right",
        pauseOnHover: true,
      });
    }
  }

  const handleFrameBtnPress = async (
    btnIndex: number,
    localFrame: NeynarFrame,
    setLocalFrame: React.Dispatch<React.SetStateAction<NeynarFrame>>,
    inputValue?: string
  ): Promise<NeynarFrame> => {
    if (!signerValue) {
      showToast(ToastType.Error, "Signer UUID is not available");
      throw new Error("Signer UUID is not available");
    }

    const button = localFrame.buttons.find((btn: { index: number }) => btn.index === btnIndex);
    const postUrl = button?.post_url;
    try {
      const response = await fetchWithTimeout('/api/frame/action', {
        method: "POST",
        headers: {
          "accept": "application/json",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          signer_uuid: signerValue,
          castHash: '0xeff44ecf9982ef5f706d3f7bdeb116af489d30e7',
          action: {
            "button": button,
            "frames_url": localFrame.frames_url,
            "post_url": postUrl ? postUrl : localFrame.frames_url,
            "input": {
                "text": inputValue
            }
          }
        })
      }) as Response;

      if (response.ok) {
        const json = await response.json() as NeynarFrame;
        if (Object.keys(json).includes('transaction_calldata')) {
          return localFrame;
        } else {
          return json;
        }
      } else {
        showToast(ToastType.Error, `HTTP error! status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      showToast(ToastType.Error, `An error occurred while processing the button press: ${(error as Error).message}`);
      throw error;
    }
  };

  return (
    <ScreenLayout>
      <main className="flex flex-col flex-grow justify-center items-center">
        {user ? (
          <>
            <NeynarProfileCard fid={user.fid} viewerFid={3} />
            <div className="max-w-[60%] md:max-w-[45%] mt-[2.5%] flex flex-row gap-8 items-end overflow-x-scroll">
              <NeynarFrameCard 
                url="https://highlight.xyz/mint/667dfcfe5229c603647108f0" 
                onFrameBtnPress={handleFrameBtnPress} 
              />
              <NeynarFrameCard 
                url="https://events.xyz/events/a010d617" 
                onFrameBtnPress={handleFrameBtnPress} 
              />
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </ScreenLayout>
  );
};

function fetchWithTimeout(url: string, options: RequestInit, timeout: number = 8000): Promise<Response> {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeout)
    )
  ]);
}

export default Home;