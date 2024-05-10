import Image from "next/image";
import ScreenLayout from "../layout";
import styles from "./index.module.scss";
import Button from "@/components/Button";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { ErrorRes } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { useState } from "react";
import { useNeynarContext } from "@neynar/react";

const Home = () => {
  const { user } = useNeynarContext();
  const [text, setText] = useState("");

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

  return (
    <ScreenLayout>
      <main className="flex flex-col flex-grow justify-center items-center">
        {user ? (
          <>
            <p className="text-3xl">
              Hello <span className="font-medium">{user.display_name}</span>
              ... 👋
            </p>
            <div className={styles.inputContainer}>
              <Image
                src={user.pfp_url || ""}
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
          </>
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </ScreenLayout>
  );
};

export default Home;
