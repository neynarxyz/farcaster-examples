import { useState, useEffect, useRef } from "react";

export const welcomeMessages = [
  "Join the conversation. Sign in to share your story on Warpcast.",
  "Ready to make your mark? Sign in to start casting on Warpcast.",
  "Sign in to cast your thoughts and connect with the Warpcast community.",
  "Be part of the decentralized dialogue. Sign in to cast your first post now.",
  "Let's get your ideas out there. Sign in to start casting your unique perspective.",
  "Elevate your voice. Sign in and amplify your message.",
  "Connect, engage, and influence. Sign in to begin your Warpcast journey.",
  "Make waves with your words. Sign in and cast away!",
  "Sign in and join a new era of social networking.",
];

export const getMessage = (messagesList: string[]) => {
  return messagesList[Math.floor(Math.random() * messagesList.length)];
};

type DeserializeFunction<T> = (value: string) => T;
type SerializeFunction<T> = (value: T) => string;

interface UseLocalStorageStateOptions<T> {
  serialize?: SerializeFunction<T>;
  deserialize?: DeserializeFunction<T>;
}

function useLocalStorageState<T>(
  key: string,
  defaultValue: T | (() => T) = "" as T,
  {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  }: UseLocalStorageStateOptions<T> = {}
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    const valueInLocalStorage = window.localStorage.getItem(key);
    if (valueInLocalStorage) {
      try {
        return deserialize(valueInLocalStorage);
      } catch (error) {
        window.localStorage.removeItem(key);
      }
    }
    return typeof defaultValue === "function"
      ? (defaultValue as () => T)()
      : (defaultValue as T);
  });

  const prevKeyRef = useRef<string>(key);

  useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey);
    }
    prevKeyRef.current = key;
    window.localStorage.setItem(key, serialize(state));
  }, [key, state, serialize]);

  return [state, setState];
}

export default useLocalStorageState;
