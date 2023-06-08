const express = require("express");
const helmet = require("helmet");
const { authenticationSB } = require("./utils/SimpleBook/authenticationSB.js");
const {
  getBookingDetails,
} = require("./utils/SimpleBook/getBookingDetails.js");
const { generatePasscode } = require("./utils/TTLock/generatePasscode.js");
const { postCustomPasscode } = require("./utils/TTLock/postCustomPasscode.js");
const { sendMail } = require("./utils/sendMail.js");
const {
  setCommentForBooking,
} = require("./utils/SimpleBook/setCommentForBooking.js");
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
    const { booking_id: bookingId, notification_type: notificationType } =
      req.body;
    if ((!bookingId, !notificationType))
      return res.status(400).json("Invalid callback");

    if (notificationType === "create") {
      const { startUnixTime, endUnixTime, clientEmail } =
        await getBookingDetails(10, tokensSB);
      // console.log(startUnixTime, endUnixTime, clientEmail);
      // Tokens may have been refreshed
      // console.log(tokensSB.accessToken, tokensSB.refreshToken);

      const keyboardPwd = await generatePasscode();

      const { keyboardPwdId } = await postCustomPasscode(
        startUnixTime,
        endUnixTime,
        keyboardPwd
      );

      await setCommentForBooking(10, tokensSB, keyboardPwdId);

      await sendMail(clientEmail);

      res.sendStatus(200);
    } else if (notificationType === "change") {
    }
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
