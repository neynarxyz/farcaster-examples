import Constants from "expo-constants";

export const COMPUTER_IP_ADDRESS = Constants.expoConfig!.extra!.COMPUTER_IP_ADDRESS;

export const API_URL = `http://${COMPUTER_IP_ADDRESS}:5500`;

