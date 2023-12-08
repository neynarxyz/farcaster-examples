"use client";

import Image from "next/image";
import ScreenLayout from "../layout";
import styles from "./index.module.scss";
import Button from "@/components/Button";
import useLocalStorage from "@/hooks/use-local-storage-state";
import { UserInfo } from "@/types";
import { useCallback, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { ErrorRes } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { useApp } from "@/Context/AppContext";

const Home = () => {
  const [user] = useLocalStorage<UserInfo>("user");
  const { displayName, text, setText } = useApp();

  const handlePublishCast = useCallback(async () => {
    if (user) {
      const { signerUuid } = user;
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
  }, [user, text]);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (e.target.value.length > 320) {
        toast("Cast is too long", {
          type: "error",
          theme: "dark",
          autoClose: 3000,
          position: "bottom-right",
          pauseOnHover: true,
        });
      }
      setText(e.target.value);
    },
    [setText]
  );

  const getContext = useCallback(() => {
    return displayName ? (
      <>
        <p className="text-3xl">
          Hello{" "}
          {displayName && <span className="font-medium">{displayName}</span>}
          ... 👋
        </p>
        <div className={styles.inputContainer}>
          <Image
            src="https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_jpg,w_168/https%3A%2F%2Fi.imgur.com%2FLPzRlQl.jpg"
            width={40}
            height={40}
            alt="User Profile Picture"
            className={`${styles.profilePic} rounded-full`}
          />
          <textarea
            onChange={handleTextChange}
            className={styles.userInput}
            placeholder="Say Something"
            rows={5}
          />
        </div>
        <Button onClick={handlePublishCast} title="Cast" />
      </>
    ) : (
      <p>Loading...</p>
    );
  }, [displayName, handlePublishCast, handleTextChange]);

  return (
    <ScreenLayout>
      <main className="flex flex-col flex-grow justify-center items-center">
        {getContext()}
      </main>
    </ScreenLayout>
  );
};

export default Home;
