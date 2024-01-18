import { Text, StyleSheet } from "react-native";
import {
  NeynarSigninButton,
  Theme,
  Variant,
} from "@neynar/react-native-signin";
import { NEYNAR_API_KEY, NEYNAR_CLIENT_ID } from "../../../constants";
import { useApp } from "../../Context/AppContext";
import Layout from "../Layout";

const Signin = () => {
  const { handleSignin } = useApp();

  return (
    <Layout>
      <Text style={styles.title}>Wowow Farcaster</Text>
      <NeynarSigninButton
        apiKey={NEYNAR_API_KEY}
        clientId={NEYNAR_CLIENT_ID}
        successCallback={handleSignin}
        variant={Variant.FARCASTER}
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
