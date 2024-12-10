// import ScreenLayout from "../layout";
// import { NeynarAuthButton, SIWN_variant } from "@neynar/react";

// const Signin = () => {
//   return (
//     <ScreenLayout>
//       <main className="flex-grow flex flex-col items-center justify-center">
//         <div className="mx-5 flex flex-col items-center justify-center">
//           <h2 className="text-4xl font-extralight mb-4">Wowow Farcaster</h2>
//         </div>
//         <NeynarAuthButton variant={SIWN_variant.NEYNAR}  />
//       </main>
//     </ScreenLayout>
//   );
// };

// export default Signin;

import React from "react";
import ScreenLayout from "../layout";
import {
  NeynarAuthButton,
  SIWN_variant,
  useNeynarContext,
} from "@neynar/react";
import { createPublicClient, http } from "viem";
import { optimism } from "viem/chains";
import { ID_REGISTRY_ABI, ID_REGISTRY_ADDRESS, ToastType } from "@/utils";

const publicClient = createPublicClient({
  chain: optimism,
  transport: http(),
});

const Signin: React.FC = () => {
  const { showToast } = useNeynarContext();

  const handleSignup = async () => {
    try {
      // 1. Check for MetaMask
      if (
        typeof window === "undefined" ||
        typeof window.ethereum === "undefined"
      ) {
        showToast(ToastType.Error, "MetaMask is not installed. Redirecting...");

        window.open("https://metamask.io/download/", "_blank");
        return;
      }

      // 2. Request user login in MetaMask
      const accounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const userAddress = accounts[0];
      if (!userAddress) {
        showToast(
          ToastType.Error,
          "No MetaMask account detected. Please log in to MetaMask."
        );
        return;
      }

      // 3. Switch to Optimism network
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xa" }], // Optimism chainId in hex
        });
      } catch (switchError) {
        showToast(
          ToastType.Error,
          "Failed to switch to Optimism network. Please switch manually."
        );
        return;
      }

      // 4. Fetch FID from Neynar API
      const fidResponse = await fetch(
        "https://api.neynar.com/v2/farcaster/user/fid",
        {
          headers: {
            "x-api-key": "YOUR_API_KEY", // Replace with your actual API key
            accept: "application/json",
          },
        }
      );
      if (!fidResponse.ok) {
        showToast(ToastType.Error, "Failed to fetch FID from Neynar API.");
        return;
      }
      const fidData = await fidResponse.json();
      const fid = fidData.fid;
      if (!fid) {
        showToast(ToastType.Error, "FID not found in API response.");
        return;
      }

      // 5. Fetch nonce from IdRegistry contract
      const requestedUserNonce = (await publicClient.readContract({
        address: ID_REGISTRY_ADDRESS,
        abi: ID_REGISTRY_ABI,
        functionName: "nonces",
        args: [userAddress],
      })) as bigint;

      // 6. Compute deadline (1 hour from now)
      const now = Math.floor(Date.now() / 1000);
      const deadline = now + 3600;

      // 7. Construct EIP-712 typed data
      const domain = {
        name: "Farcaster IdRegistry",
        version: "1",
        chainId: 10,
        verifyingContract: "0x00000000Fc6c5F01Fc30151999387Bb99A9f489b",
      };

      const types = {
        Transfer: [
          { name: "fid", type: "uint256" },
          { name: "to", type: "address" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };

      const message = {
        fid: fid.toString(),
        to: userAddress,
        nonce: requestedUserNonce.toString(),
        deadline: deadline.toString(),
      };

      const typedData = {
        domain,
        types,
        primaryType: "Transfer",
        message,
      };

      // 8. Request signature from MetaMask
      const signature = await window.ethereum.request({
        method: "eth_signTypedData_v4",
        params: [userAddress, JSON.stringify(typedData)],
        from: userAddress,
      });

      if (!signature) {
        showToast(ToastType.Error, "User rejected signature request.");
        return;
      }

      // If all goes well, you have the signature and can proceed with the flow
      showToast(ToastType.Success, "Successfully signed the data.");

      // Here, you might send the signature along with the fid and other info to your backend.
      // await submitSignatureToYourBackend({ fid, signature, userAddress, nonce: requestedUserNonce, deadline });
    } catch (error) {
      console.error(error);
      showToast(ToastType.Error, "An error occurred during signup.");
    }
  };

  return (
    <ScreenLayout>
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="mx-5 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-extralight mb-4">Wowow Farcaster</h2>
        </div>
        <NeynarAuthButton variant={SIWN_variant.NEYNAR} />

        {/* New Signup Button */}
        <button
          onClick={handleSignup}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Signup
        </button>
      </main>
    </ScreenLayout>
  );
};

export default Signin;
