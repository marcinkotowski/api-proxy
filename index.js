const express = require("express");
const helmet = require("helmet");
const { Authentication } = require("./utils/authentication.js");
require("dotenv").config();

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(helmet());

let token;
let refreshToken;

app.post("/generate-passcode", async (req, res) => {
  try {
    // Fetch booking_id and booking_hash
    const { booking_id, booking_hash } = req.body;
    if (!booking_id || !booking_hash)
      return res.status(400).json("Invalid callback");

    res.status(200).json({ booking_id, booking_hash });
  } catch (error) {
    res.status(500).json(error);
  }
});

async function startServer() {
  try {
    const authData = await Authentication();
    token = authData.token;
    refreshToken = authData.refresh_token;
    console.log(token, refreshToken);

    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (error) {
    console.error(error);
  }
}

startServer();
