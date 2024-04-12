const express = require("express");
const {
  NeynarAPIClient,
  AuthorizationUrlResponseType,
} = require("@neynar/nodejs-sdk");
var { json } = require("body-parser");
require("dotenv").config({ path: ".env" });

const app = express();

app.use(json());

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const NEYNAR_CLIENT_ID = process.env.NEYNAR_CLIENT_ID;

const client = new NeynarAPIClient(NEYNAR_API_KEY);

app.get("/get-auth-url", async (_, res) => {
  try {
    const { authorization_url } = await client.fetchAuthorizationUrl(
      NEYNAR_CLIENT_ID,
      AuthorizationUrlResponseType.Code
    );
    res.json({ authorization_url });
  } catch (error) {
    if (error.isAxiosError) {
      console.error("Error:", error);
      res.status(error.response.status).json({ error });
    } else {
      console.error("Error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
});

app.get("/user", async (req, res) => {
  const { fid } = req.query;

  try {
    const { users } = await client.fetchBulkUsers([fid]);
    const user = users[0];
    const { display_name, pfp_url } = user;
    res.json({ display_name, pfp_url });
  } catch (error) {
    if (error.isAxiosError) {
      console.error("Error:", error);
      res.status(error.response.status).json({ error });
    } else {
      console.error("Error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
});

app.post("/cast", async (req, res) => {
  const { signerUuid, text } = req.body;

  try {
    const { hash } = await client.publishCast(signerUuid, text);
    res.json({ hash });
  } catch (error) {
    if (error.isAxiosError) {
      console.error("Error:", error);
      res.status(error.response.status).json({ error });
    } else {
      console.error("Error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
});

const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
