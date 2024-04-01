import neynarClient from "./utils/neynarClient";
import { NeynarFrameCreationRequest } from "@neynar/nodejs-sdk/build/neynar-api/v2";

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    try {
      const body = await req.text();
      const hookData = JSON.parse(body);

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

      if (!process.env.SIGNER_UUID) {
        throw new Error("Make sure you set SIGNER_UUID in your .env file");
      }

      const reply = await neynarClient.publishCast(
        process.env.SIGNER_UUID,
        `gm ${hookData.data.author.username}`,
        {
          embeds: [
            {
              url: frame.link,
            },
          ],
          replyTo: hookData.data.hash,
        }
      );

      return new Response(`Replied to the cast with hash: ${reply.hash}`);
    } catch (e: any) {
      return new Response(e.message, { status: 500 });
    }
  },
});

console.log(`Listening on localhost:${server.port}`);
