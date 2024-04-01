# Farcaster frames bot

# Create a bot to reply with frames using neynar

In this guide, we’ll take a look at how to create a Farcaster bot that replies to specific keywords with a frame created on the go specifically for the reply! Here’s an example of the same:

![Demo of the farcaster frames bot](https://github.com/neynarxyz/farcaster-examples/assets/76690419/d5749625-ce9c-46da-b8aa-49bb9be8fd0f)

For this guide, we'll go over:

1. Creating a webhook which listens to casts
2. Creating a bot which replies to the casts
3. Creating frames dynamically using the neynar SDK

Before we begin, you can access the [complete source code](https://github.com/neynarxyz/farcaster-examples/tree/main/frames-bot) for this guide on GitHub.

Let's get started!

## Setting up our server

### Creating a bun server

I am going to use a [bun server](https://bun.sh/) for the sake of simplicity of this guide, but you can use express, Next.js api routes or any server that you wish to use!

Create a new server by entering the following commands in your terminal:

```bash
mkdir frames-bot
cd frames-bot
bun init
```

We are going to need the `@neynar/nodejs-sdk` , so let’s install that as well:

```tsx
bun add @neynar/nodejs-sdk
```

Once the project is created and the packages are installed, you can open it in your favourite editor and add the following in `index.ts`:

```tsx
const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    try {
      return new Response("Welcome to bun!");
    } catch (e: any) {
      return new Response(e.message, { status: 500 });
    }
  },
});

console.log(`Listening on localhost:${server.port}`);
```

This, creates a server using bun which we will be using soon!

Finally, run the server using the following command:

```bash
bun run index.ts
```

### Serve the app via ngrok

We’ll serve the app using ngrok, so that we can use this URL in the webhook. If you don’t already have it installed, install it from [here](https://ngrok.com/download). Once it’s installed authenticate using your authtoken and serve your app using this command:

```bash
ngrok http http://localhost:3000
```

![Serve your app using ngrok](https://github.com/neynarxyz/farcaster-examples/assets/76690419/7f3e8d33-1aef-4723-948c-436c56658864)

## Creating a webhook

We need to create a webhook on the neynar dashboard that will listen for certain words/mentions and all our server which will then reply to the cast. So, head over to the neynar dashboard and go to the [webhooks tab](https://dev.neynar.com/webhook). Click on new webhook and enter the details as such:

![Create a new webhook on the neynar dashboard](https://github.com/neynarxyz/farcaster-examples/assets/76690419/643fb19c-c19d-4534-8e30-fd567a845301)

The target URL should be the URL you got from the ngrok command and you can select whichever event you want to listen to. I’ve chosen to listen to all the casts with “farcasterframesbot” in it. Once you have entered all the info click on create, and it will create a webhook for you.

## Creating the bot

Head over to the [app section](https://dev.neynar.com/app) in the [neynar dashboard](https://dev.neynar.com/) and copy the signer uuid for your account:

![Copy the signer uuid for the bot](https://github.com/neynarxyz/farcaster-examples/assets/76690419/a6a56060-612c-4ff1-bf67-b01a0b43bcf3)

Create a new `.env` file in the root of your project and add the following:

```bash
SIGNER_UUID=your_signer_uuid
NEYNAR_API_KEY=your_neynar_api_key
```

Add the signer UUID to the `SIGNER_UUID` and the neynar api key to the `NEYNAR_API_KEY` which you can get from the overview section of the neynar dashboard:

![Copy neynar api key from the dashboard](https://github.com/neynarxyz/farcaster-examples/assets/76690419/f55d7ee4-a2d2-4c61-ac0f-bf7074a80a60)

Create a `neynarClient.ts` file and add the following:

```tsx
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

if (!process.env.NEYNAR_API_KEY) {
  throw new Error("Make sure you set NEYNAR_API_KEY in your .env file");
}

const neynarClient = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

export default neynarClient;
```

Here we initialise the neynar client which we can use to publish casts. Head back to `index.ts` and add this inside the try block:

```tsx
if (!process.env.SIGNER_UUID) {
  throw new Error("Make sure you set SIGNER_UUID in your .env file");
}

const body = await req.text();
const hookData = JSON.parse(body);

const reply = await neynarClient.publishCast(
  process.env.SIGNER_UUID,
  `gm ${hookData.data.author.username}`,
  {
    replyTo: hookData.data.hash,
  }
);
console.log("reply:", reply);
```

You also need to import the neynar client in the `index.ts` file:

```tsx
import neynarClient from "./neynarClient";
```

This will now reply to every cast that has the word “farcasterframesbot” in it with a gm. Pretty cool, right?

Let’s take this a step further and reply with a frame instead of boring texts!

## Creating the frame

We’ll now generate a unique frame for every user on the fly using neynar frames. To create the frame add the following code in `index.ts` before the reply:

```tsx
const creationRequest: NeynarFrameCreationRequest = {
  name: `gm ${hookData.data.author.username}`,
  pages: [
    {
      image: {
        url: "https://moralis.io/wp-content/uploads/web3wiki/638-gm/637aeda23eca28502f6d3eae_61QOyzDqTfxekyfVuvH7dO5qeRpU50X-Hs46PiZFReI.jpeg",
        aspect_ratio: "1:1",
      },
      title: "Page title",
      buttons: [],
      input: {
        text: {
          enabled: false,
        },
      },
      uuid: "gm",
      version: "vNext",
    },
  ],
};

const frame = await neynarClient.publishNeynarFrame(creationRequest);
```

You can edit the metadata here, I have just added a simple gm image but you can go crazy with it! Check out some templates in the [frame studio](https://dev.neynar.com/frames) for example.

Anyways let’s continue building, you also need to add the frame as an embed in the reply body like this:

```tsx
const reply = await neynarClient.publishCast(
  process.env.SIGNER_UUID,
  `gm ${hookData.data.author.username}`,
  {
    replyTo: hookData.data.hash,
    embeds: [
      {
        url: frame.link,
      },
    ],
  }
);
```

Putting it all together your final `index.ts` file should look similar to [this](https://github.com/neynarxyz/farcaster-examples/blob/main/frames-bot/index.ts).

Don't forget to restart your server after making these changes!

```bash
bun run index.ts
```

You can now create a cast on Farcaster and your webhook should be working just fine! 🥳

## Conclusion

This guide taught us how to create a Farcaster bot that replies to specific keywords with a frame created on the go! If you want to look at the completed code, check out the [GitHub repository](https://github.com/neynarxyz/farcaster-examples/tree/main/frames-bot).

Lastly, make sure to sure what you built with us on Farcaster by tagging [@neynar](https://warpcast.com/neynar) and if you have any questions, reach out to us on [warpcast](https://warpcast.com/~/channel/neynar) or [Telegram](https://t.me/rishdoteth)!
