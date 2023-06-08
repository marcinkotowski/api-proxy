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
const {
  changePasscodeDetails,
} = require("./utils/TTLock/changePasscodeDetails.js");
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

      const passcodeData = {
        keyboardPwdId,
        keyboardPwd,
      };

      await setCommentForBooking(10, tokensSB, passcodeData);

      await sendMail(clientEmail, keyboardPwd);
    } else if (notificationType === "change") {
      const { startUnixTime, endUnixTime, clientEmail, comment } =
        await getBookingDetails(10, tokensSB);

      const { keyboardPwdId, keyboardPwd } = JSON.parse(comment);

      await changePasscodeDetails(startUnixTime, endUnixTime, keyboardPwdId);

      await sendMail(clientEmail, keyboardPwd);
    }
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
