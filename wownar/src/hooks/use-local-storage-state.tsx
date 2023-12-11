"use client";

import { useState, useEffect, useRef } from "react";

type DeserializeFunction<T> = (value: string) => T;
type SerializeFunction<T> = (value: T) => string;

interface UseLocalStorageStateOptions<T> {
  serialize?: SerializeFunction<T>;
  deserialize?: DeserializeFunction<T>;
}

function useLocalStorage<T>(
  key: string,
  defaultValue: T | (() => T) = "" as T,
  { serialize = JSON.stringify, deserialize = JSON.parse }: UseLocalStorageStateOptions<T> = {}
): [T, React.Dispatch<React.SetStateAction<T>>, () => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window !== 'undefined') {
      const valueInLocalStorage = window.localStorage.getItem(key);
      if (valueInLocalStorage) {
        try {
          return deserialize(valueInLocalStorage);
        } catch (error) {
          window.localStorage.removeItem(key);
        }
      }
    }
    return typeof defaultValue === 'function' ? (defaultValue as () => T)() : defaultValue;
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

  const removeItem = () => {
    window.localStorage.removeItem(key);
  };

  return [state, setState, removeItem];
}

export default useLocalStorage;
