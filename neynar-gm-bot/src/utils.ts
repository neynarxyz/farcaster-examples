import { FARCASTER_DEVELOPER_MNEMONIC } from "./config";
import neynarClient from "./neynarClient";
import { mnemonicToAccount } from "viem/accounts";
import { viemPublicClient } from "./viemClient";
import { keyGatewayAbi } from "./abi/keyGateway";
import { encodeAbiParameters } from "viem";
import { SignedKeyRequestMetadataABI } from "./abi/SignedKeyRequestMetadata";
import { SignerStatusEnum } from "@neynar/nodejs-sdk/build/neynar-api/neynar-v2-api";
import * as fs from "fs";
import * as path from "path";

export const MESSAGE = `GM 🪐`;

const appendSignerUuidAndUsernameToEnv = (
  signer_uuid: string,
  usernameOrFid: string
) => {
  const envPath = path.resolve(__dirname, "../.env"); // Adjust the path as necessary

  fs.readFile(envPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading .env file:", err);
      return;
    }

    const newContent =
      data +
      `\nSIGNER_UUID=${signer_uuid}` +
      `\nUSERNAME_OR_FID=${usernameOrFid}`;
    fs.writeFile(envPath, newContent, "utf8", (err) => {
      if (err) {
        console.error("Error writing to .env file:", err);
        return;
      }
      console.log(
        "SIGNER_UUID appended to .env file.\nPlease run `yarn start` to continue.\n"
      );
    });
  });
};

export const getApprovedSigner = async () => {
  try {
    const { public_key: signerPublicKey, signer_uuid } =
      await neynarClient.createSigner();

    // DO NOT CHANGE ANY VALUES IN THIS CONSTANT
    const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
      name: "Farcaster SignedKeyRequestValidator",
      version: "1",
      chainId: 10,
      verifyingContract:
        "0x00000000fc700472606ed4fa22623acf62c60553" as `0x${string}`,
    };

    // DO NOT CHANGE ANY VALUES IN THIS CONSTANT
    const SIGNED_KEY_REQUEST_TYPE = [
      { name: "requestFid", type: "uint256" },
      { name: "key", type: "bytes" },
      { name: "deadline", type: "uint256" },
    ];

    const account = mnemonicToAccount(FARCASTER_DEVELOPER_MNEMONIC);

    const { user: farcasterDeveloper } =
      await neynarClient.lookupUserByCustodyAddress(account.address);

    console.log(
      `✅ Detected user with fid ${farcasterDeveloper.fid} and custody address: ${farcasterDeveloper.custody_address}`
    );

    // Generates an expiration date for the signature
    // e.g. 1693927665
    const deadline = Math.floor(Date.now() / 1000) + 86400; // signature is valid for 1 day from now

    let signature = await account.signTypedData({
      domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
      types: {
        SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
      },
      primaryType: "SignedKeyRequest",
      message: {
        requestFid: BigInt(farcasterDeveloper.fid),
        key: signerPublicKey,
        deadline: BigInt(deadline),
      },
    });

    const metadata = encodeAbiParameters(SignedKeyRequestMetadataABI.inputs, [
      {
        requestFid: BigInt(farcasterDeveloper.fid),
        requestSigner: account.address,
        signature: signature,
        deadline: BigInt(deadline),
      },
    ]);

    const developerKeyGatewayNonce = await viemPublicClient.readContract({
      address: "0x00000000fc56947c7e7183f8ca4b62398caadf0b", // gateway address
      abi: keyGatewayAbi,
      functionName: "nonces",
      args: [farcasterDeveloper.custody_address as `0x${string}`],
    });

    const SIGNED_KEY_REQUEST_VALIDATOR = {
      name: "Farcaster SignedKeyRequestValidator",
      version: "1",
      chainId: 10,
      verifyingContract:
        "0x00000000fc700472606ed4fa22623acf62c60553" as `0x${string}`,
    };

    const SIGNED_KEY_REQUEST_TYPE_FOR_ADD_FOR = [
      { name: "owner", type: "address" },
      { name: "keyType", type: "uint32" },
      { name: "key", type: "bytes" },
      { name: "metadataType", type: "uint8" },
      { name: "metadata", type: "bytes" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ];

    signature = await account.signTypedData({
      domain: SIGNED_KEY_REQUEST_VALIDATOR,
      types: {
        SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE_FOR_ADD_FOR,
      },
      primaryType: "SignedKeyRequest",
      message: {
        owner: account.address,
        keyType: 1,
        key: signerPublicKey,
        metadataType: 1,
        metadata: metadata,
        nonce: BigInt(developerKeyGatewayNonce),
        deadline: BigInt(deadline),
      },
    });

    console.log("✅ Generated signer", "\n");

    console.log(
      "In order to get an approved signer you need to do an on-chain transaction on OP mainnet. \nGo to Farcaster KeyGateway optimism explorer\nhttps://optimistic.etherscan.io/address/0x00000000fc56947c7e7183f8ca4b62398caadf0b#writeContract \n"
    );
    console.log(
      "Connect to Web3.\n\nNavigate to `addFor` function and add following values inside the respective placeholders.\n"
    );

    console.log(
      "fidOwner (address) :=> ",
      farcasterDeveloper.custody_address,
      "\n -"
    );
    console.log("keyType (uint32) :=> ", 1, "\n -");
    console.log("key (bytes) :=> ", signerPublicKey, "\n -");
    console.log("metadataType (uint8) :=> ", 1, "\n -");
    console.log("metadata (bytes) :=> ", metadata, "\n -");
    console.log("deadline (uint256) :=> ", deadline, "\n -");
    console.log("sig (bytes) :=> ", signature, "\n -\n");
    console.log(
      "We are polling for the signer to be approved. It will be approved once the onchain transaction is confirmed."
    );
    console.log("Checking for the status of signer...");

    while (true) {
      const res = await neynarClient.lookupSigner(signer_uuid);
      if (res && res.status === SignerStatusEnum.Approved) {
        console.log("✅ Approved signer", signer_uuid);
        break;
      }
      console.log("Waiting for signer to be approved...");
      await new Promise((r) => setTimeout(r, 5000));
    }

    console.log("✅ Transaction confirmed\n");
    console.log("✅ Approved signer", signer_uuid, "\n");
    appendSignerUuidAndUsernameToEnv(
      signer_uuid,
      farcasterDeveloper.username ?? farcasterDeveloper.fid
    );
  } catch (err) {
    console.log(err);
  }
};
