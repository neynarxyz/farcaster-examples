import { Text, StyleSheet } from "react-native";
import { NeynarSigninButton } from "neynar-test";

const Signin = () => {
  const handleSignIn = () => {
    console.log("Sign in");
  };

  return (
    <>
      <Text style={styles.title}>Wowow Farcaster</Text>
      <NeynarSigninButton onPress={handleSignIn} />
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
