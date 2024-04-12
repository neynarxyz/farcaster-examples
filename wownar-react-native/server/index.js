const express = require("express");
require("dotenv").config({ path: ".env" });

const app = express();

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const NEYNAR_CLIENT_ID = process.env.NEYNAR_CLIENT_ID;

console.log(NEYNAR_API_KEY, NEYNAR_CLIENT_ID);

app.get("/get-auth-url", async (_, res) => {
  const apiUrl = `https://api.neynar.com/v2/farcaster/login/authorize?api_key=${NEYNAR_API_KEY}&response_type=code&client_id=${NEYNAR_CLIENT_ID}`;

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

  const apiUrl = `https://api.neynar.com/v1/farcaster/user?fid=${fid}&api_key=${NEYNAR_API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    const {
      result: {
        user: { displayName, pfp: {url} },
      },
    } = await response.json();
    res.json({ displayName, pfp_url: url });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
