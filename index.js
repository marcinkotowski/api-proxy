const express = require("express");
const helmet = require("helmet");
const { authenticationSB } = require("./utils/SimpleBook/authenticationSB.js");
const {
  getBookingDetails,
} = require("./utils/SimpleBook/getBookingDetails.js");
const { generatePasscode } = require("./utils/TTLock/generatePasscode.js");
const { addCustomPasscode } = require("./utils/TTLock/addCustomPasscode.js");
require("dotenv").config();

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(helmet());

const tokensSB = {
  accessToken: null,
  refreshToken: null,
};

app.post("/generate-passcode", async (req, res) => {
  try {
    // const { booking_id: bookingId } = req.body;
    // if (!bookingId) return res.status(400).json("Invalid callback");

    const { startUnixTime, endUnixTime, clientEmail } = await getBookingDetails(
      10,
      tokensSB
    );
    // console.log(startUnixTime, endUnixTime, clientEmail);
    // Tokens may have been refreshed
    // console.log(tokensSB.accessToken, tokensSB.refreshToken);

    const passcode = await generatePasscode();

    const { keyboardPwdId } = await addCustomPasscode(
      startUnixTime,
      endUnixTime,
      passcode
    );
    // console.log(passcode, keyboardPwdId);

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
    console.log(tokensSB.accessToken, tokensSB.refreshToken);

    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (error) {
    console.error(error);
  }
}

startServer();
