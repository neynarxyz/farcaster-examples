# wownar-react-sdk

## Introduction

`wownar-react-sdk` is a Next.js app that demonstrates the integration of the [@neynar/react](https://www.npmjs.com/package/@neynar/react) SDK both for [SIWN](https://docs.neynar.com/docs/how-to-let-users-connect-farcaster-accounts-with-write-access-for-free-using-sign-in-with-neynar-siwn) and implementing cast/frame write actions from your own, secure backend. `@neynar/react` makes implementation much simpler by managing the state for you, which wasn't possible in an earlier version of [SIWN](https://docs.neynar.com/docs/how-to-let-users-connect-farcaster-accounts-with-write-access-for-free-using-sign-in-with-neynar-siwn). 

## Prerequisites

- [Node.js](https://nodejs.org/en/): A JavaScript runtime built on Chrome's V8 JavaScript engine. Ensure you have Node.js installed on your system.

## Installation and Setup Environment

1. **Install Project Dependencies**: Based on the package manager run one of the following commands to install all required dependencies:

   For yarn

   ```bash
   yarn install
   ```

   For npm

   ```bash
   npm install
   ```

2. **Configure Environment Variables**

   - Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

   - Edit `.env` to add your `NEYNAR_API_KEY` and `NEXT_PUBLIC_NEYNAR_CLIENT_ID`.

## Run Application

   - For yarn

      ```bash
      yarn dev
      ```

   - For npm

      ```bash
      npm run dev
      ```

### How to securely implement write actions
There are currently two components that offer props for develoeprs to handle write actions: `NeynarCastCard`(write action handlers for cast reactions) and `NeynarFeedCard`(write action handlers for frame interactions). 

We highly recommend that you call Neynar's POST APIs(or other intended APIs) from your own, authenticated server to ensure that your Neynar API key credentials are not exposed on the client-side. `wownar-react-sdk` offers an example of client-side SDK implementation with calls to the Neynar API made through Next.js API routes. As an even further measure to extend security practices, we would recommend that your backend server is using some form of [token-based authentication](https://www.cloudflare.com/learning/access-management/token-based-authentication/), such as a JWT.

In the meantime, here are snippets from the relevant code in `wownar-react-sdk` that demonstrate how to securely implement write actions:

#### `<NeynarCastCard>` write actions

1. In `/src/app/Screens/Home/index.tsx`, initialize the `NeynarCastCard` component and pass both allowReactions as true and handlers for any reactions we want to add write actions for(`onLikeBtnPress`, `onCommentBtnPress`, and `onRecastBtnPress`)
```
   <NeynarCastCard 
      type="url"
      identifier={castUrl}
      allowReactions={true}
      renderEmbeds={true}
      renderFrames={true}
      onLikeBtnPress={handleLikeBtnPress}
      onCommentBtnPress={handleCommentBtnPress}
      onRecastBtnPress={handleRecastBtnPress}
      onFrameBtnPress={handleFrameBtnPress}
   />
```

2. (same file) Call our Next.js API route to handle the like action and return true/false to indicate the response data
```
function handleLikeBtnPress() {
    let success = false;
    function sendLikeRequest() {
      return fetch("/api/cast/reaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signerUuid: signerValue,
          reaction: ReactionType.Like,
          castOrCastHash: castUrl,
        }),
      });
    }
    sendLikeRequest()
      .then((response) => {
        if (response.status === 200) {
          success = true;
        }
      })
      .catch((error) => {
        success = false;
      });
    return success;
  } 
```

3. In `/src/app/api/cast/reaction/route.ts`, securely call the Neynar API using our Node.js SDK and return the response
```
export async function POST(request: NextRequest) {
  const { signerUuid, reaction, castOrCastHash } = (await request.json()) as {
    signerUuid: string;
    reaction: ReactionType
    castOrCastHash: string | Cast;
  };

  try {
    const { success, message } = await neynarClient.publishReactionToCast(signerUuid, reaction, castOrCastHash);
    return NextResponse.json(
      { message: `Cast ${reaction} with hash ${castOrCastHash} published successfully` },
      { status: 200 }
    );
  } catch (err) {
    console.log("/api/cast/reaction", err);
    if (isApiErrorResponse(err)) {
      return NextResponse.json(
        { ...err.response.data },
        { status: err.response.status }
      );
    } else
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
  }
}
```

#### `<NeynarFrameCard>` write actions

1. In `/src/app/Screens/Home/index.tsx`, initialize the `NeynarFrameCard` component and pass `onFrameBtnPress` to handle frame button press actions.
```
   <NeynarFrameCard 
      url={frameUrl}
      onFrameBtnPress={handleFrameBtnPress} 
   />
```

2. (same file) Call our Next.js API route and/or determine the frame action type(eg. for redirects and mints) and then return the next frame
```
const handleFrameBtnPress = async (
    btnIndex: number,
    localFrame: NeynarFrame,
    setLocalFrame: React.Dispatch<React.SetStateAction<NeynarFrame>>,
    inputValue?: string
  ): Promise<NeynarFrame> => {
    if (!signerValue) {
      showToast(ToastType.Error, "Signer UUID is not available");
      throw new Error("Signer UUID is not available");
    }

    const button = localFrame.buttons.find((btn: { index: number }) => btn.index === btnIndex);
    const postUrl = button?.post_url;

    try {
      const response = await fetchWithTimeout('/api/frame/action', {
        method: "POST",
        headers: {
          "accept": "application/json",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          signer_uuid: signerValue,
          castHash: '0xeff44ecf9982ef5f706d3f7bdeb116af489d30e7',
          action: {
            "button": button,
            "frames_url": localFrame.frames_url,
            "post_url": postUrl ? postUrl : localFrame.frames_url,
            "input": {
                "text": inputValue
            }
          }
        })
      }) as Response;

      if (response.ok) {
        const json = await response.json() as NeynarFrame;
        if (json.transaction_calldata) {
          const { chainId, method, params } = json.transaction_calldata;
          const { to, data, value } = params;

          const parsedValue = BigInt(value);

          const { address, walletClient } = await connectWallet(chainId);

          try {
            const hash = await walletClient.sendTransaction({
              account: address as Address,
              to,
              value: parsedValue,
              data,
              chain: getChainConfig(chainId),
            });

            const publicClient = createPublicClient({
              chain: getChainConfig(chainId),
              transport: http(),
            });

            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            showToast(ToastType.Success, "Transaction successful!");
            const newResp = await fetchWithTimeout('/api/frame/action', {
              method: "POST",
              headers: {
                "accept": "application/json",
                "content-type": "application/json"
              },
              body: JSON.stringify({
                signer_uuid: signerValue,
                castHash: '0xeff44ecf9982ef5f706d3f7bdeb116af489d30e7',
                action: {
                  "button": button,
                  "frames_url": json.frames_url,
                  "post_url": (json as any).post_url ? (json as any).post_url : json.frames_url,
                  "input": {
                      "text": inputValue
                  },
                  "address": address,
                  "transaction": {
                    "hash": hash
                  }
                }
              })
            }) as Response;
            if(newResp.ok){
              const newData = await newResp.json();
              if (newData) {
                return newData;
              }
            }
          } catch (txError) {
            if ((txError as any).message.indexOf("User rejected the request") !== -1) {
              showToast(ToastType.Warning, "Transaction rejected by the user.");
            } else {
              showToast(ToastType.Error, `Transaction failed: ${(txError as Error).message}`);
              throw txError;
            }
          }

          return localFrame;
        } else {
          return json;
        }
      } else {
        const responseError = await response.json();
        throw responseError.message;
      }
    } catch (error) {
      throw error;
    }
  };
```

3. In `/src/app/api/frame/action/route.ts`, securely call the Neynar frame action API using our Node.js SDK and return the response
```
export async function POST(request: NextRequest) {
  const { signer_uuid, castHash, action} = (await request.json()) as {
    signer_uuid: string;
    castHash: string;
    action: any;
  };

  try {
    const response = await neynarClient.postFrameAction(signer_uuid, castHash, action);

    if (response) {
      return NextResponse.json(response, { status: 200 });
    } else {
      return NextResponse.json(response, { status: 500 });
    }
  } catch (err) {
    console.log("/api/frame/action", err);
    if (isApiErrorResponse(err)) {
      return NextResponse.json(
        { ...err.response.data },
        { status: err.response.status }
      );
    } else {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
    }
  }
}
```

## License

`wownar-react-sdk` is released under the MIT License. This license permits free use, modification, and distribution of the software, with the requirement that the original copyright and license notice are included in any substantial portion of the work.