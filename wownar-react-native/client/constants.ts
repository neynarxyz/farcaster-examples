import Constants from "expo-constants";

const SERVER_IP = Constants.expoConfig!.extra!.SERVER_IP;

export const API_URL = `http://${SERVER_IP}:5500`;
