import { Text, StyleSheet } from "react-native";
import {
  NeynarSigninButton,
} from "@neynar-test/subfolder-test";
import { NEYNAR_API_KEY, NEYNAR_CLIENT_ID } from "../../../constants";
import { useApp } from "../../Context/AppContext";

const Signin = () => {
  const { handleSignin } = useApp();

  return (
    <>
      <Text style={styles.title}>Wowow Farcaster</Text>
      <NeynarSigninButton
        apiKey={NEYNAR_API_KEY}
        clientId={NEYNAR_CLIENT_ID}
        successCallback={handleSignin}
      />
    </>
  );
};

export default Signin;

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    color: "#fff",
    marginBottom: 24,
    fontWeight: "100",
  },
});
