# Cast Action

In this guide, we’ll make a cast action with the neynar SDK and frog.fm, within a few minutes! The cast action will fetch the follower count of the cast's author using its fid and display it.

Before we begin, you can access the [complete source code](https://github.com/neynarxyz/farcaster-examples/tree/main/cast-action) for this guide on GitHub.

Let's get started!

<br>

## Creating a new frames project

We will use [bun](https://bun.sh/) and [frog](https://frog.fm/) for building the cast action in this guide, but you can feel free to use anything else!

Enter this command in your terminal to create a new app:

```powershell
bunx create-frog -t bun
```

Enter a name for your project and it will spin up a new project for you. Once the project is created install the dependencies:

```powershell
cd <project_name>
bun install
```

Now, let's install the dependencies that we are going to need to build out this action:

```powershell
bun add @neynar/nodejs-sdk dotenv
```

### Creating the cast action route

Head over to the `src/index.ts` file. Here, you'll be able to see a starter frame on the / route. But first, let's change the Frog configuration to use `/api` as the base path and use neynar for hubs like this:

```typescript index.tsx
export const app = new Frog({
  hub: neynar({ apiKey: "NEYNAR_FROG_FM" }),
  basePath: "/api",
});
```

You also might need to import neynar from "frogs/neynar":

```typescript index.tsx
import { neynar } from "frog/hubs";
```

Now, we'll create a new post route which will handle our cast actions. So, create a new route like this:

```typescript index.tsx
app.hono.post("/followers", async (c) => {
  try {
    let message = "GM";
    return c.json({ message });
  } catch (error) {
    console.error(error);
  }
});
```

This route will return a GM message every time the action is clicked, but let's now use the neynar SDK to get the follower count of the cast's author!

Create a new `src/lib/neynarClient.ts` file and add the following:

```typescript neynarClient.ts
import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";
import { config } from "dotenv";

config();

if (!process.env.NEYNAR_API_KEY) {
  throw new Error("Make sure you set NEYNAR_API_KEY in your .env file");
}

const neynarConfig = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY,
  baseOptions: {
    headers: {
      "x-neynar-experimental": true,
    },
  },
});

const neynarClient = new NeynarAPIClient(neynarConfig);

export default neynarClient;
```

Here, we initialise the neynarClient with the neynar api key which you can get from your dashboard:

![](https://files.readme.io/794cfad-image.png)

Add the api key in a `.env` file with the name `NEYNAR_API_KEY`.

Head back to the `src/index.tsx` file and add the following in the followers route instead of the GM message:

```typescript index.tsx
try {
  const body = await c.req.json();
  const result = await neynarClient.validateFrameAction(
    body.trustedData.messageBytes
  );

  const { users } = await neynarClient.fetchBulkUsers([
    Number(result.action.cast.author.fid),
  ]);

  if (!users) {
    return c.json({ message: "Error. Try Again." }, 500);
  }

  let message = `Count:${users[0].follower_count}`;

  return c.json({ message });
} catch (e) {
  return c.json({ message: "Error. Try Again." }, 500);
}
```

Here, we use the neynar client that we just initialised to first validate the action and get the data from the message bytes. Then, we use it to fetch the user information using the `fetchBulkUsers` function. Finally, we return a message with the follower count!

### Creating a frame with add cast action button

I am also adding a simple frame that allows anyone to install the action. But for that, you need to host your server somewhere, for local development you can use ngrok.

If you don’t already have it installed, install it from [here](https://ngrok.com/download). Once it’s installed authenticate using your auth token and serve your app using this command:

```powershell
ngrok http http://localhost:5173/
```

This command will give you a URL which will forward the requests to your localhost:

![](https://files.readme.io/9e1852c-image.png)

You can now head over to the [cast action playground](https://warpcast.com/~/developers/cast-actions) and generate a new URL by adding in the info as such:

![](https://files.readme.io/47248c2-image.png)

Copy the install URL and paste it into a new variable in the `index.tsx` like this:

```typescript index.tsx
const ADD_URL =
  "https://warpcast.com/~/add-cast-action?actionType=post&name=Followers&icon=person&postUrl=https%3A%2F%2F05d3-2405-201-800c-6a-70a7-56e4-516c-2d3c.ngrok-free.app%2Fapi%2Ffollowers";
```

Finally, you can replace the / route with the following to have a simple frame which links to this URL:

```typescript index.tsx
app.frame("/", (c) => {
  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <h2
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          gm! Add cast action to view followers count
        </h2>
      </div>
    ),
    intents: [<Button.Link href={ADD_URL}>Add Action</Button.Link>],
  });
});
```

If you now start your server using `bun run dev` and head over to <http://localhost:5173/dev> you'll be able to see a frame somewhat like this:

![](https://files.readme.io/ff041d7-image.png)

Click on Add action and it'll prompt you to add a new action like this:

![](https://files.readme.io/08fc953-image.png)

Once you have added the action, you can start using it on Warpcast to see the follower count of various people! 🥳

## Conclusion

This guide taught us how to create a Farcaster cast action that shows the follower count of the cast's author! If you want to look at the completed code, check out the [GitHub repository](https://github.com/neynarxyz/farcaster-examples/tree/main/cast-action).

Lastly, make sure to sure what you built with us on Farcaster by tagging [@neynar](https://warpcast.com/neynar) and if you have any questions, reach out to us on [warpcast](https://warpcast.com/~/channel/neynar) or [Telegram](https://t.me/rishdoteth)!
