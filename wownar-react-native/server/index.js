const express = require("express");
var { json } = require("body-parser");
require("dotenv").config({ path: ".env" });

const app = express();

app.use(json());

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const NEYNAR_CLIENT_ID = process.env.NEYNAR_CLIENT_ID;

const API_URL = "https://api.neynar.com/v2/farcaster";

app.get("/get-auth-url", async (_, res) => {
  const apiUrl = `${API_URL}/login/authorize?api_key=${NEYNAR_API_KEY}&response_type=code&client_id=${NEYNAR_CLIENT_ID}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch auth url");
    }
    const { authorization_url } = await response.json();
    res.json({ authorization_url });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/user", async (req, res) => {
  const { fid } = req.query;

  try {
    const response = await fetch(`${API_URL}/user/bulk?fids=${fid}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        api_key: NEYNAR_API_KEY,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    const { users } = await response.json();
    const user = users[0];
    const { display_name, pfp_url } = user;
    res.json({ display_name, pfp_url });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/cast", async (req, res) => {
  const { signerUuid, text } = req.body;

  console.log(signerUuid, text);

  try {
    const response = await fetch(`${API_URL}/cast`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        api_key: NEYNAR_API_KEY,
      },
      body: JSON.stringify({
        signer_uuid: signerUuid,
        text,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to cast");
    }
    const {
      cast: { hash },
    } = await response.json();
    res.json({ hash });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
