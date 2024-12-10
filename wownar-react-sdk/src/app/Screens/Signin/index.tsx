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

import React, { useEffect, useState, useCallback } from "react";
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
  const [userAddress, setUserAddress] = useState<string | null>(null);

  console.log("userAddress", userAddress);

  // UseEffect to handle account changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          setUserAddress(accounts[0]);
        } else {
          setUserAddress(null);
        }
      };

      // Listen for account changes
      window.ethereum.on("accountsChanged", handleAccountsChanged);

      // Cleanup the event listener when component unmounts
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  }, []);

  const handleSignup = async () => {
    try {
      // 1. Check for wallet
      if (
        typeof window === "undefined" ||
        typeof window.ethereum === "undefined"
      ) {
        showToast(
          ToastType.Error,
          "No wallet is not installed. Redirecting..."
        );
        window.open("https://metamask.io/download/", "_blank");
        return;
      }

      // If we don't have a userAddress already, request it
      if (!userAddress) {
        const accounts: string[] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length === 0) {
          showToast(
            ToastType.Error,
            "No wallet detected. Please log in to a wallet."
          );
          return;
        }
        setUserAddress(accounts[0]);
      }

      // Double-check we have a userAddress here
      if (!userAddress) {
        showToast(
          ToastType.Error,
          "No wallet detected. Please log in to a wallet."
        );
        return;
      }

      // 2. Switch to Optimism network
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

      // 3. Fetch FID from Neynar API
      const fidResponse = await fetch("/api/user");
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

      // 4. Fetch nonce from IdRegistry contract
      const requestedUserNonce = (await publicClient.readContract({
        address: ID_REGISTRY_ADDRESS,
        abi: ID_REGISTRY_ABI,
        functionName: "nonces",
        args: [userAddress],
      })) as bigint;

      // 5. Compute deadline (1 hour from now)
      const now = Math.floor(Date.now() / 1000);
      const deadline = now + 3600;

      // 6. Construct EIP-712 typed data
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

      // 7. Request signature from a wallet
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

      // Here, send the signature along with the fid and other info to your backend if needed.
      console.log("Fields", {
        fid,
        signature,
        requestedUserCustodyAddress: userAddress,
        deadline,
      });
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

        <div className="flex items-center justify-center">
          <NeynarAuthButton variant={SIWN_variant.NEYNAR} />
          <span className="mx-2">|</span>
          <button
            onClick={handleSignup}
            className="flex items-center px-4 py-4 bg-white text-black font-semibold text-[14px] leading-[19px] rounded-full shadow-sm hover:shadow-md"
          >
            <span className="">Sign up</span>
          </button>
        </div>

        {/* Wallet Connection Status Indicator */}
        <div className="mt-4 flex items-center">
          <span
            className={`h-3 w-3 rounded-full mr-2 ${
              userAddress ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          <span>
            {userAddress
              ? `Wallet Connected (${userAddress})`
              : "Wallet Not Connected (For signup wallet connection is required)"}
          </span>
        </div>
      </main>
    </ScreenLayout>
  );
};

export default Signin;
