import { Text, StyleSheet } from "react-native";
import { NeynarSigninButton } from "neynar-test";

const Signin = () => {

  return (
    <>
      <Text style={styles.title}>Wowow Farcaster</Text>
      <NeynarSigninButton
        apiKey="ntest"
        clientId="50f40c78-a885-4290-8278-556a3c0b0ed4"
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
