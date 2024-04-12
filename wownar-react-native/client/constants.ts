import Constants from "expo-constants";

const COMPUTER_IP_ADDRESS = Constants.expoConfig!.extra!.COMPUTER_IP_ADDRESS;

export const API_URL = `http://${COMPUTER_IP_ADDRESS}:5500`;
