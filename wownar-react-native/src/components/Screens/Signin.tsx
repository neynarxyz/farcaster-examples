import { Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NeynarSigninButton } from "neynar-test";

const Signin = () => {
  const handleSignIn = () => {
    console.log("Sign in");
  };

  return (
    <>
      <Text style={styles.title}>Wowow Farcaster...</Text>
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
    fontWeight: "200",
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 24,
    minWidth: 218,
    width: 218,
  },
  logo: { width: 24, height: 24, marginRight: 10 },
  signInText: { fontSize: 16, fontWeight: "300" },
});
