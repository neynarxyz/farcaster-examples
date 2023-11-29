import { FARCASTER_BOT_MNEMONIC } from "./config";
import neynarClient from "./neynarClient";
import { mnemonicToAccount } from "viem/accounts";
import { viemPublicClient } from "./viemClient";
import { keyGatewayAbi } from "./abi/keyGateway";
import { encodeAbiParameters } from "viem";
import { SignedKeyRequestMetadataABI } from "./abi/SignedKeyRequestMetadata";
import { SignerStatusEnum } from "@neynar/nodejs-sdk/build/neynar-api/neynar-v2-api";
import * as fs from "fs";
import * as path from "path";
import { isApiErrorResponse } from "@neynar/nodejs-sdk";

// A constant message for greeting or logging.
export const MESSAGE = `gm 🪐`;

/**
 * Appends the signer_uuid to the .env file.
 * @param signer_uuid - Approved signer UUID of the user.
 */
const appendSignerUuidAndUsernameToEnv = (signer_uuid: string) => {
  // Resolving the path to the .env file.
  const envPath = path.resolve(__dirname, "../.env");

  // Reading the .env file.
  fs.readFile(envPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading .env file:", err);
      return;
    }

    // Appending the SIGNER_UUID to the file content.
    const newContent = data + `\nSIGNER_UUID=${signer_uuid}`;

    // Writing the updated content back to the .env file.
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

/**
 * Generates an approved signer for the user.
 */
export const getApprovedSigner = async () => {
  try {
    // Creating a new signer and obtaining its public key and UUID.
    const { public_key: signerPublicKey, signer_uuid } =
      await neynarClient.createSigner();

    // Constants for the EIP-712 domain and request type, required for signing data.
    // DO NOT CHANGE ANY VALUES IN THESE CONSTANTS
    const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
      name: "Farcaster SignedKeyRequestValidator", // EIP-712 domain data for the SignedKeyRequestValidator.
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

    // Convert mnemonic to an account object.
    const account = mnemonicToAccount(FARCASTER_BOT_MNEMONIC);

    // Lookup user details using the custody address.
    const { user: farcasterDeveloper } =
      await neynarClient.lookupUserByCustodyAddress(account.address);

    console.log(
      `✅ Detected user with fid ${farcasterDeveloper.fid} and custody address: ${farcasterDeveloper.custody_address}`
    );

    // Generates an expiration date for the signature
    // e.g. 1693927665
    const deadline = Math.floor(Date.now() / 1000) + 86400; // signature is valid for 1 day from now

    // Signing the key request data.
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

    // Encoding ABI parameters for the metadata.
    const metadata = encodeAbiParameters(SignedKeyRequestMetadataABI.inputs, [
      {
        requestFid: BigInt(farcasterDeveloper.fid),
        requestSigner: account.address,
        signature: signature,
        deadline: BigInt(deadline),
      },
    ]);

    // Interacting with a blockchain contract to get a nonce value.
    const developerKeyGatewayNonce = await viemPublicClient.readContract({
      address: "0x00000000fc56947c7e7183f8ca4b62398caadf0b", // gateway address
      abi: keyGatewayAbi,
      functionName: "nonces",
      args: [farcasterDeveloper.custody_address as `0x${string}`],
    });

    // Additional EIP-712 domain and type definitions for the key gateway.
    const KEY_GATEWAY_EIP_712_DOMAIN = {
      name: "Farcaster KeyGateway",
      version: "1",
      chainId: 10,
      verifyingContract:
        "0x00000000fc56947c7e7183f8ca4b62398caadf0b" as `0x${string}`,
    };

    // Signing data for the Add operation.
    const ADD_TYPE = [
      { name: "owner", type: "address" },
      { name: "keyType", type: "uint32" },
      { name: "key", type: "bytes" },
      { name: "metadataType", type: "uint8" },
      { name: "metadata", type: "bytes" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ];

    signature = await account.signTypedData({
      domain: KEY_GATEWAY_EIP_712_DOMAIN,
      types: {
        Add: ADD_TYPE,
      },
      primaryType: "Add",
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

    // Logging instructions and values for the user to perform on-chain transactions.
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

    // Polling for the signer status until it is approved.
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
    // Once approved, appending the signer UUID to the .env file.
    appendSignerUuidAndUsernameToEnv(signer_uuid);
  } catch (err) {
    // Error handling, checking if it's an API response error.
    if (isApiErrorResponse(err)) {
      console.log(err.response.data);
    } else console.log(err);
  }
};
