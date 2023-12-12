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
  {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  }: UseLocalStorageStateOptions<T> = {}
): [T, React.Dispatch<React.SetStateAction<T>>, () => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window !== "undefined") {
      try {
        const valueInLocalStorage = window.localStorage.getItem(key);
        return valueInLocalStorage
          ? deserialize(valueInLocalStorage)
          : defaultValue instanceof Function
          ? defaultValue()
          : defaultValue;
      } catch (error) {
        console.error("Error reading from localStorage:", error);
        return defaultValue instanceof Function ? defaultValue() : defaultValue;
      }
    }
    return defaultValue instanceof Function ? defaultValue() : defaultValue;
  });

  const prevKeyRef = useRef<string>(key);

  useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key && typeof window !== "undefined") {
      window.localStorage.removeItem(prevKey);
    }
    prevKeyRef.current = key;
    try {
      window.localStorage.setItem(key, serialize(state));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [key, state, serialize]);

  const removeItem = () => {
    window.localStorage.removeItem(key);
  };

  return [state, setState, removeItem];
}

export default useLocalStorage;
