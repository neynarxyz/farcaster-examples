"use client";

import Image from "next/image";
import ScreenLayout from "../layout";
import styles from "./index.module.scss";
import Button from "@/components/Button";
import useLocalStorage from "@/hooks/use-local-storage-state";
import { UserInfo } from "@/types";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { ErrorRes } from "@neynar/nodejs-sdk/build/api/models";
import { useApp } from "@/Context/AppContext";
import { useState } from "react";
import Link from "next/link";

const Home = () => {
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedReqBody, setCopiedReqBody] = useState(false);
  const [user] = useLocalStorage<UserInfo>("user");
  const { displayName, pfp, fid } = useApp();
  const [text, setText] = useState("");
  const { signerUuid } = user;
  async function handlePublishCast() {
    try {
      const {
        data: { message },
      } = await axios.post<{ message: string }>("/api/cast", {
        signerUuid,
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
  const handleCopy = async (
    text: string,
    setCopied: (value: boolean) => void
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  const curlText = `curl -X POST "https://demo.neynar.com/api/cast" \\
  -H "Content-Type: application/json" \\
  -d '{
    "signerUuid": "${signerUuid}",
    "text": "Writing to @farcaster via the @neynar APIs ✍️"
  }'`;

  const reqBody = `curl -X POST "https://demo.neynar.com/api/cast" \\
  -H "Content-Type: application/json" \\
  -d '{
    "signerUuid": "${signerUuid}",
    "text": "Writing to @farcaster via the @neynar APIs ✍️",
    "embeds": [
      {
        "cast_id": {
          "hash": "<cast_hash>",
          "fid": 193
        },
        "url": "google.com"
      }
    ],
    "channel_id": "neynar"
  }'`;

  const profileLink = `https://warpcast.com/~/profiles/${fid}`;
  return (
    <ScreenLayout>
      <main className="flex flex-col flex-grow justify-center items-center">
        {displayName && pfp ? (
          <>
            <p className="text-3xl">
              Hello{" "}
              {displayName && (
                <span className="font-medium">{displayName}</span>
              )}
              ... 👋
            </p>
            <div className={styles.inputContainer}>
              <Image
                src={pfp}
                width={40}
                height={40}
                alt="User Profile Picture"
                className={`${styles.profilePic} rounded-full`}
              />
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className={styles.userInput}
                placeholder="Say Something"
                rows={5}
              />
            </div>
            <Button onClick={handlePublishCast} title="Cast" />
            <div className="w-[460px] flex flex-col gap-4 pt-20 text-sm">
              <span>
                You can publish casts over API using the code block below. Free
                API is rate limited, upgrade{" "}
                <Link
                  href="https://neynar.com/pricing"
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  here
                </Link>{" "}
                for more features.
              </span>
              
              <span>
                Casts will be sent from <Link
                  href={profileLink}
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  {displayName}
                </Link>{""}. Sign in with a different
                account if needed.
              </span>

              <div className="bg-neutral-700 text-gray-200 p-4 mt-4 font-mono text-sm relative">
                <pre className="whitespace-break-spaces">{curlText}</pre>

                <Image
                  src="/logos/copy_clipboard.svg"
                  width={30}
                  height={30}
                  alt="Copy Clipboard Logo"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(curlText, setCopiedCurl);
                  }}
                  className="absolute top-2 right-2 hover:bg-neutral-600 rounded text-gray-300 transition cursor-pointer"
                />
                {copiedCurl && (
                  <span className="absolute top-0 right-0 text-xs text-black">
                    Copied!
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-0.5 mt-12">
                <span>
                  To include embeds or post in a channel, add an embeds array or
                  channel_id to the request body:
                </span>
                <div className="bg-neutral-700 text-gray-200 p-4 mt-4 font-mono text-sm relative">
                  <pre className="whitespace-break-spaces">{reqBody}</pre>
                  <Image
                    src="/logos/copy_clipboard.svg"
                    width={30}
                    height={30}
                    alt="Copy Clipboard Logo"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(reqBody, setCopiedReqBody);
                    }}
                    className="absolute top-2 right-2 hover:bg-neutral-600 rounded text-gray-300 transition cursor-pointer"
                  />
                  {copiedReqBody && (
                    <span className="absolute top-0 right-0 text-xs text-black">
                      Copied!
                    </span>
                  )}
                </div>
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

export default Home;
