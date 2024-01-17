import { Text, StyleSheet } from "react-native";
import { NeynarSigninButton } from "@neynar/react-native-signin";
import { NEYNAR_API_KEY, NEYNAR_CLIENT_ID } from "../../../constants";
import { useApp } from "../../Context/AppContext";
import Layout from "../Layout";

const Signin = () => {
  const { handleSignin, isAuthenticated } = useApp();

  return (
    <Layout>
      <Text style={styles.title}>Wowow Farcaster</Text>
      <NeynarSigninButton
        apiKey={NEYNAR_API_KEY}
        clientId={NEYNAR_CLIENT_ID}
        successCallback={handleSignin}
      />
      <Text style={{ color: "white" }}>{`${isAuthenticated}`}</Text>
    </Layout>
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
