import { ISuccessMessage } from "@neynar/react-native-signin";
import * as SecureStore from "expo-secure-store";

const KEY = "userInfo";

export const storeUser = async (data: ISuccessMessage) => {
  try {
    await SecureStore.setItemAsync(KEY, JSON.stringify(data));
  } catch (error) {
    console.log("Error storing credentials", error);
  }
};

export const retrieveUser = async () => {
  try {
    const user = await SecureStore.getItemAsync(KEY);
    if (!user) return null;
    return JSON.parse(user) as ISuccessMessage;
  } catch (error) {
    console.error(`Error retrieving ${KEY}`, error);
    return null;
  }
};

export const removeUser = async () => {
  try {
    await SecureStore.deleteItemAsync(KEY);
  } catch (error) {
    console.error(`Error deleting ${KEY}`, error);
  }
};
