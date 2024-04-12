import { Text, StyleSheet } from "react-native";
import { NeynarSigninButton } from "@neynar/react-native-signin";
import { useApp } from "../../Context/AppContext";
import Layout from "../Layout";
import { NEYNAR_API_KEY, NEYNAR_CLIENT_ID } from "../../../constants";

const Signin = () => {
  const { handleSignin } = useApp();

  // This function should be an API call to your server where NEYNAR_API_KEY and NEYNAR_CLIENT_ID are stored securely
  const fetchAuthorizationUrl = async () => {
    const res = await fetch(
      `https://api.neynar.com/v2/farcaster/login/authorize?api_key=${NEYNAR_API_KEY}&response_type=code&client_id=${NEYNAR_CLIENT_ID}`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch auth url");
    }
    const { authorization_url } = (await res.json()) as {
      authorization_url: string;
    };
    return authorization_url;
  };

  const handleError = (error: Error) => {
    console.error(error);
  };

  return (
    <Layout>
      <Text style={styles.title}>Wowow Farcaster</Text>
      <NeynarSigninButton
        fetchAuthorizationUrl={fetchAuthorizationUrl}
        successCallback={handleSignin}
        errorCallback={handleError}
        // --------------- Customization options props ---------------
        // variant={Variant.FARCASTER}
        // logoSize="40" // Only for variant not for customLogoUrl
        // paddingHorizontal={20}
        // paddingVertical={0}
        // borderRadius={50}
        // width={214}
        // height={48}
        // color="black"
        // fontSize={16}
        // theme={Theme.LIGHT}
        // text="Sign in with Apple"
        // margin={0}
        // fontWeight="300"
        // buttonStyles={{
        //   // buttonStyles will override all the buttonStyles above
        //   marginTop: 20,
        // }}
        // textStyles={{
        //   // textStyles will override all the textStyles above
        //   color: "grey",
        // }}
        // backgroundColor="#fff"
        // customLogoUrl="https://lh4.googleusercontent.com/pzcL7G25jch7H0Vpgm9NvY_C47dcs2jBCJ0rcTApLLOhOBgQ1M7zLyq3qCAJT3HLkuPq_6CECXpVtCmK8-6PA0lXDNAtPTixHiZahoomXOmEfxzMFs-REzysEaJ5tPaRAH0wtFclD1HD_cHC9c-5-q4"
      />
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
