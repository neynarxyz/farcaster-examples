import { Text, StyleSheet } from "react-native";
import { ISuccessMessage, NeynarSigninButton } from "neynar-test";
import { useState } from "react";
import { NEYNAR_API_KEY, NEYNAR_CLIENT_ID } from "../../../constants";

const Signin = () => {
  const [data, setData] = useState<ISuccessMessage | null>(null);

  return (
    <>
      <Text style={styles.title}>Wowow Farcaster</Text>
      <NeynarSigninButton
        apiKey={NEYNAR_API_KEY}
        clientId={NEYNAR_CLIENT_ID}
        successCallback={(_data) => {
          typeof data == "object" && setData(_data);
        }}
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
