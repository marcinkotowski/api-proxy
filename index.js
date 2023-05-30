const express = require("express");
const helmet = require("helmet");
const { authenticationSB } = require("./utils/SimpleBook/authenticationSB.js");
const { authenticationTTL } = require("./utils/TTLock/authenticationTTL.js");
const { bookingDetails } = require("./utils/SimpleBook/bookingDetails.js");
require("dotenv").config();

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(helmet());

const tokensSB = {
  accessToken: null,
  refreshToken: null,
};

const tokensTTL = {
  accessToken: null,
  refreshToken: null,
};

app.post("/generate-passcode", async (req, res) => {
  try {
    const { booking_id: bookingId } = req.body;
    if (!bookingId) return res.status(400).json("Invalid callback");

    const { startUnixTime, endUnixTime, clientEmail } = await bookingDetails(
      bookingId,
      tokensSB
    );

    console.log(startUnixTime, endUnixTime, clientEmail);
    console.log(tokensSB.accessToken, tokensSB.refreshToken);

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

async function startServer() {
  try {
    const authDataSB = await authenticationSB();
    tokensSB.accessToken = authDataSB.token;
    tokensSB.refreshToken = authDataSB.refresh_token;

    const authDataTTL = await authenticationTTL();
    tokensTTL.accessToken = authDataTTL.access_token;
    tokensTTL.refreshToken = authDataTTL.refresh_token;

    console.log(tokensSB.accessToken, tokensSB.refreshToken);
    console.log(tokensTTL.accessToken, tokensTTL.refreshToken);

    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (error) {
    console.error(error);
  }
}

startServer();
