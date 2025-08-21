import Image from "next/image";
import ScreenLayout from "../layout";
import styles from "./index.module.scss";
import Button from "@/components/Button";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { ErrorRes, ReactionType } from "@neynar/nodejs-sdk/build/api";
import { useState, useEffect } from "react";
import { NeynarFrameCard, NeynarProfileCard, NeynarCastCard, useNeynarContext } from "@neynar/react";
import {
  http,
  custom,
  createWalletClient,
  createPublicClient,
  parseEther,
  type Address,
  type TransactionReceipt,
} from 'viem';
import { mainnet, base } from 'viem/chains';

declare global {
  interface Window {
    ethereum: any;
  }
}

export enum ToastType {
  Success = "success",
  Error = "error",
  Warning = "warning",
  Info = "info",
}

const NEYNAR_API_URL = "https://sdk-api.neynar.com";

export type TransactionCalldata = {
  chainId: string;
  method: string;
  params: {
    abi: any[];
    to: `0x${string}`;
    data: `0x${string}`;
    value: string;
  };
};

export type NeynarFrame = {
  version: string;
  title?: string;
  image: string;
  image_aspect_ratio?: string;
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
  transaction_calldata?: TransactionCalldata;
};

const Home = () => {
  const { user, client_id, showToast } = useNeynarContext();
  const [text, setText] = useState("");
  const [signerValue, setSignerValue] = useState<string | null>(user?.signer_uuid || null);
  const [account, setAccount] = useState<Address | null>(null);
  const [frameUrl, setFrameUrl] = useState<string>('https://highlight.xyz/mint/667dfcfe5229c603647108f0');
  const [castUrl, setCastUrl] = useState<string>('https://warpcast.com/slokh/0x57e03c32');
  const [key, setKey] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"frame" | "cast">("frame");

  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, [frameUrl, castUrl]);

  const getChainConfig = (chainId: string) => {
    switch (chainId) {
      case 'eip155:1':
        return mainnet;
      case 'eip155:8453':
        return base;
      default:
        throw new Error("Unsupported chain");
    }
  };

  const switchChain = async (chainId: string) => {
    if (!window.ethereum) {
      throw new Error("Injected wallet is not installed.");
    }
    
    const targetChain = getChainConfig(chainId);
    const chainIdHex = `0x${Number(targetChain.id).toString(16)}`;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (switchError) {
      if ((switchError as any).code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainIdHex,
                chainName: targetChain.name,
                rpcUrls: [targetChain.rpcUrls.default.http[0]],
              },
            ],
          });
        } catch (addError) {
          throw new Error("Failed to add chain to injected wallet.");
        }
      } else {
        throw new Error("Failed to switch chain in injected wallet.");
      }
    }
  };

  const connectWallet = async (chainId: string) => {
    await switchChain(chainId);

    const walletClient = createWalletClient({
      chain: getChainConfig(chainId),
      transport: custom(window.ethereum),
    });

    const [address] = await walletClient.requestAddresses();
    setAccount(address);
    return { address, walletClient };
  };

  function handleLikeBtnPress() {
    let success = false;
    function sendLikeRequest() {
      return fetch("/api/cast/reaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signerUuid: signerValue,
          reaction: ReactionType.Like,
          castOrCastHash: castUrl,
        }),
      });
    }
    sendLikeRequest()
      .then((response) => {
        if (response.status === 200) {
          success = true;
        }
      })
      .catch((error) => {
        success = false;
      });
    return success;
  }  

  function handleCommentBtnPress(){
    return false;
  }

  function handleRecastBtnPress() {
    let success = false;
    function sendLikeRequest() {
      return fetch("/api/cast/reaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signerUuid: signerValue,
          reaction: ReactionType.Recast,
          castOrCastHash: castUrl,
        }),
      });
    }
    sendLikeRequest()
      .then((response) => {
        if (response.status === 200) {
          success = true;
        }
      })
      .catch((error) => {
        success = false;
      });
    return success;
  }

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
        if (json.transaction_calldata) {
          const { chainId, method, params } = json.transaction_calldata;
          const { to, data, value } = params;

          const parsedValue = BigInt(value);

          const { address, walletClient } = await connectWallet(chainId);

          try {
            const hash = await walletClient.sendTransaction({
              account: address as Address,
              to,
              value: parsedValue,
              data,
              chain: getChainConfig(chainId),
            });

            const publicClient = createPublicClient({
              chain: getChainConfig(chainId),
              transport: http(),
            });

            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            showToast(ToastType.Success, "Transaction successful!");
            const newResp = await fetchWithTimeout('/api/frame/action', {
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
                  "frames_url": json.frames_url,
                  "post_url": (json as any).post_url ? (json as any).post_url : json.frames_url,
                  "input": {
                      "text": inputValue
                  },
                  "address": address,
                  "transaction": {
                    "hash": hash
                  }
                }
              })
            }) as Response;
            if(newResp.ok){
              const newData = await newResp.json();
              if (newData) {
                return newData;
              }
            }
          } catch (txError) {
            if ((txError as any).message.indexOf("User rejected the request") !== -1) {
              showToast(ToastType.Warning, "Transaction rejected by the user.");
            } else {
              showToast(ToastType.Error, `Transaction failed: ${(txError as Error).message}`);
              throw txError;
            }
          }

          return localFrame;
        } else {
          return json;
        }
      } else {
        const responseError = await response.json();
        throw responseError.message;
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <ScreenLayout>
      <main className="flex flex-col flex-grow justify-center items-center">
      {user ? (
        <>
          <NeynarProfileCard fid={user.fid} viewerFid={3} />
          <p className="pt-5 text-lg font-medium">Write components</p>
          <div className="max-w-[60%] md:max-w-[45%] mt-[2.5%] flex flex-col gap-1 items-start">
            <div className="flex flex-row gap-4 mb-4">
              <button
                onClick={() => setActiveTab("frame")}
                className={`px-4 py-2 rounded-full ${
                  activeTab === "frame" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Frame
              </button>
              <button
                onClick={() => setActiveTab("cast")}
                className={`px-4 py-2 rounded-full ${
                  activeTab === "cast" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Cast
              </button>
            </div>
            <div className="w-full min-h-[300px]">
              {activeTab === "frame" ? (
                <>
                  <div className="flex flex-row gap-2 items-center w-full">
                    <p className="font-medium text-sm">Frame URL:</p>
                    <input
                      className="rounded-lg p-2 flex-grow"
                      type="text"
                      placeholder="Enter frame url"
                      value={frameUrl}
                      onChange={(e) => setFrameUrl(e.target.value)}
                    />
                  </div>
                  <NeynarFrameCard 
                    key={key}
                    url={frameUrl}
                    onFrameBtnPress={handleFrameBtnPress} 
                  />
                </>
              ) : (
                <>
                  <div className="flex flex-row gap-2 items-center w-full pb-4">
                    <p className="font-medium text-sm">Cast URL:</p>
                    <input
                      className="rounded-lg p-2 flex-grow"
                      type="text"
                      placeholder="Enter cast url"
                      value={castUrl}
                      onChange={(e) => setCastUrl(e.target.value)}
                    />
                  </div>
                  <NeynarCastCard 
                    type="url"
                    identifier={castUrl}
                    allowReactions={true}
                    renderEmbeds={true}
                    renderFrames={true}
                    onLikeBtnPress={handleLikeBtnPress}
                    onCommentBtnPress={handleCommentBtnPress}
                    onRecastBtnPress={handleRecastBtnPress}
                    onFrameBtnPress={handleFrameBtnPress}
                  />
                </>
              )}
            </div>
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