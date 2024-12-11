import React, { useEffect, useState } from "react";
import ScreenLayout from "../layout";
import {
  NeynarAuthButton,
  SIWN_variant,
  useNeynarContext,
} from "@neynar/react";
import { createWalletClient, custom, publicActions } from "viem";
import { optimism } from "viem/chains";
import { ID_REGISTRY_ABI, ID_REGISTRY_ADDRESS, ToastType } from "@/utils";

const InvalidFnameErrorMessage =
  "Invalid format. The string must start with a letter or number, can include letters, numbers, or hyphens (up to 16 characters total), and cannot contain any other characters";

const Signin: React.FC = () => {
  const { showToast } = useNeynarContext();

  const [showSignupForm, setShowSignupForm] = useState(false);

  const [fid, setFid] = useState<number | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [requestedUserCustodyAddress, setRequestedUserCustodyAddress] =
    useState<string | null>();
  const [deadline, setDeadline] = useState<number | null>();

  const [isFnameAvailable, setIsFnameAvailable] = useState<boolean | null>(
    null
  );
  const [fnameError, setFnameError] = useState<string | null>(null);

  // Form state
  const [fname, setFname] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [latitude, setLatitude] = useState("");
  const [bio, setBio] = useState("");
  const [url, setUrl] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [longitude, setLongitude] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // UseEffect to handle account changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          setRequestedUserCustodyAddress(accounts[0]);
        } else {
          setRequestedUserCustodyAddress(null);
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
      setIsLoading(true);
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

      let _requestedUserCustodyAddress;

      // If we don't have a userAddress already, request it
      if (!requestedUserCustodyAddress) {
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
        _requestedUserCustodyAddress = accounts[0];
        setRequestedUserCustodyAddress(accounts[0]);
      }

      // Double-check we have a userAddress here
      if (!_requestedUserCustodyAddress) {
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
          params: [{ chainId: "0xA" }], // Optimism chainId in hex
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

      const wallet = createWalletClient({
        chain: optimism,
        transport: custom(window.ethereum),
      }).extend(publicActions);

      // 4. Fetch nonce from IdRegistry contract
      const requestedUserNonce = (await wallet.readContract({
        address: ID_REGISTRY_ADDRESS,
        abi: ID_REGISTRY_ABI,
        functionName: "nonces",
        args: [_requestedUserCustodyAddress],
      })) as bigint;

      // 5. Compute deadline (1 hour from now)
      const now = Math.floor(Date.now() / 1000);
      const deadline = now + 3600;

      // 6. Construct EIP-712 typed data
      const domain = {
        name: "Farcaster IdRegistry",
        version: "1",
        chainId: 10,
        verifyingContract: ID_REGISTRY_ADDRESS as `0x${string}`,
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
        fid: BigInt(fid),
        to: _requestedUserCustodyAddress,
        nonce: requestedUserNonce,
        deadline: BigInt(deadline),
      };

      // 7. Request signature from a wallet
      const signature = await wallet.signTypedData({
        account: _requestedUserCustodyAddress as `0x${string}`,
        domain,
        types,
        primaryType: `Transfer`,
        message,
      });

      if (!signature) {
        showToast(ToastType.Error, "User rejected signature request.");
        return;
      }

      showToast(ToastType.Success, "Successfully signed the data.");

      // Set the form values
      setFid(fid);
      setSignature(signature);
      setRequestedUserCustodyAddress(_requestedUserCustodyAddress);
      setDeadline(deadline);

      setIsLoading(false);
      setShowSignupForm(true);
    } catch (error) {
      console.error(error);
      showToast(ToastType.Error, "An error occurred during signup.");
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowSignupForm(false);
    setFname("");
    setProfilePicUrl("");
    setLatitude("");
    setBio("");
    setUrl("");
    setDisplayName("");
    setLongitude("");
  };

  const handleFormSubmit = async () => {
    if (isFnameAvailable === false) {
      showToast(ToastType.Error, "Username is not available.");
      return;
    }

    if (fnameError) {
      showToast(ToastType.Error, InvalidFnameErrorMessage);
      return;
    }

    if (!fid || !signature || !requestedUserCustodyAddress || !deadline) {
      showToast(ToastType.Error, "Missing required fields.");
      return;
    }

    // try converting latitude and longitude to numbers if they fail to convert throw an error

    let _latitude;
    let _longitude;

    try {
      _latitude = parseFloat(latitude);
      _longitude = parseFloat(longitude);
    } catch (error) {
      showToast(ToastType.Error, "Latitude and Longitude must be numbers.");
      return;
    }

    const metadata = {
      bio,
      pfp_url: profilePicUrl,
      url,
      display_name: displayName,
      location: {
        latitude: _latitude,
        longitude: _longitude,
      },
    };

    // remove empty fields recursively
    const removeEmpty = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === "object") removeEmpty(obj[key]);
        else if (obj[key] === undefined) delete obj[key];
      });
    };

    removeEmpty(metadata);

    try {
      setIsLoading(true);
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fid,
          signature,
          requestedUserCustodyAddress,
          deadline,
          fname,
          metadata,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      const data = await response.json();

      setIsLoading(false);

      showToast(ToastType.Success, "Successfully signed up!");

      const neynar_authenticated_user = {
        signer_uuid: data.signer.signer_uuid,
        ...(data.user ? data.user : {}),
      };

      localStorage.setItem(
        "neynar_authenticated_user",
        JSON.stringify(neynar_authenticated_user)
      );

      window.location.reload();
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      showToast(ToastType.Error, "An error occurred during signup.");
    }
  };

  const handleFnameBlur = async () => {
    if (!fname) {
      setIsFnameAvailable(null);
      setFnameError(null);
      return;
    }

    const fnameRegex = /^[a-z0-9][a-z0-9-]{0,15}$/;
    if (!fnameRegex.test(fname)) {
      setFnameError(InvalidFnameErrorMessage);
      setIsFnameAvailable(null);
      return;
    }

    setFnameError(null);

    try {
      const response = await fetch(
        `/api/user/fname/availability?fname=${fname}`
      );

      if (!response.ok) {
        throw new Error("Failed to check fname availability.");
      }

      const data = await response.json();
      setIsFnameAvailable(data.available);
    } catch (error) {
      console.error("Error checking fname availability:", error);
      setIsFnameAvailable(false);
    }
  };

  return (
    <ScreenLayout>
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="mx-5 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-extralight mb-4">Wowow Farcaster</h2>
        </div>

        {!showSignupForm ? (
          <div>
            <div className="flex items-center justify-center space-x-2">
              <NeynarAuthButton variant={SIWN_variant.NEYNAR} />
              <span>|</span>
              <button
                onClick={handleSignup}
                className="flex items-center px-4 py-4 bg-white text-black font-semibold text-sm rounded-full shadow-sm hover:shadow-md"
              >
                Sign up
                {isLoading && (
                  <div className="w-4 h-4 ml-2 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
                )}
              </button>
            </div>
            <div className="mt-4 flex items-center">
              <span
                className={`h-3 w-3 rounded-full mr-2 ${
                  requestedUserCustodyAddress ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              <span>
                {requestedUserCustodyAddress
                  ? `Wallet Connected (${requestedUserCustodyAddress})`
                  : "Wallet Not Connected (For signup wallet connection is required)"}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-lg p-6 bg-white shadow-md rounded-md mt-4">
            <h3 className="text-xl font-semibold mb-4">Complete Your Signup</h3>
            <div className="my-4 flex items-center">
              <span
                className={`h-3 w-3 rounded-full mr-2 ${
                  requestedUserCustodyAddress ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              <span>
                {requestedUserCustodyAddress
                  ? `Wallet Connected (${requestedUserCustodyAddress})`
                  : "Wallet Not Connected (For signup wallet connection is required)"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col col-span-2">
                <label className="text-sm mb-1 font-medium">Username</label>
                <input
                  type="text"
                  value={fname}
                  onChange={(e) => {
                    setIsFnameAvailable(null);
                    setFname(e.target.value);
                  }}
                  onBlur={handleFnameBlur}
                  className={`border p-2 rounded ${
                    fnameError
                      ? "border-red-500"
                      : isFnameAvailable === false
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="john_doe"
                />
                {fnameError && (
                  <p className="text-red-500 text-sm mt-1">{fnameError}</p>
                )}
                {isFnameAvailable === false && !fnameError && (
                  <p className="text-red-500 text-sm mt-1">
                    username `{fname}` is not available
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-sm mb-1 font-medium">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="border p-2 rounded"
                  placeholder="John Doe"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm mb-1 font-medium">Bio</label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="border p-2 rounded"
                  placeholder="Enter bio"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm mb-1 font-medium">
                  Profile picture url
                </label>
                <input
                  type="text"
                  value={profilePicUrl}
                  onChange={(e) => setProfilePicUrl(e.target.value)}
                  className="border p-2 rounded"
                  placeholder="Enter profile picture url"
                />
              </div>

              <div className="flex flex-col col-span-1">
                <label className="text-sm mb-1 font-medium">Url</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="border p-2 rounded"
                  placeholder="Enter Url"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm mb-1 font-medium">Latitude</label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="border p-2 rounded"
                  placeholder="Enter Latitude"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm mb-1 font-medium">Longitude</label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="border p-2 rounded"
                  placeholder="Enter Longitude"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-4 bg-white text-black font-semibold text-sm rounded-full shadow-sm hover:shadow-md border border-black"
              >
                Cancel
              </button>

              <button
                onClick={handleFormSubmit}
                className="flex items-center px-4 py-4 bg-black text-white font-semibold text-sm rounded-full shadow-sm hover:shadow-md"
              >
                Submit
                {isLoading && (
                  <div className="w-4 h-4 ml-2 border-4 border-white-300 border-t-gray-800 rounded-full animate-spin"></div>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </ScreenLayout>
  );
};

export default Signin;
