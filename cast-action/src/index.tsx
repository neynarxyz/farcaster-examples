import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import neynarClient from "./lib/neynarClient.js";
import { neynar } from "frog/hubs";

export const app = new Frog({
  hub: neynar({ apiKey: "NEYNAR_FROG_FM" }),
  basePath: "/api",
});

const ADD_URL =
  "https://warpcast.com/~/add-cast-action?actionType=post&name=Followers&icon=person&postUrl=https%3A%2F%2F05d3-2405-201-800c-6a-70a7-56e4-516c-2d3c.ngrok-free.app%2Fapi%2Ffollowers";

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

app.hono.post("/followers", async (c) => {
  try {
    const body = await c.req.json();
    const result = await neynarClient.validateFrameAction({
      messageBytesInHex: body.trustedData.messageBytes,
    });

    const user = result.action.cast.author;

    let message = `Count:${user.follower_count}`;

    return c.json({ message });
  } catch (e) {
    return c.json({ message: "Error. Try Again." }, 500);
  }
});

app.use("/*", serveStatic({ root: "./public" }));
devtools(app, { serveStatic });

if (typeof Bun !== "undefined") {
  Bun.serve({
    fetch: app.fetch,
    port: 3000,
  });
  console.log("Server is running on port 3000");
}
