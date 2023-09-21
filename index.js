const express = require("express");
const helmet = require("helmet");
const {
  authenticationSB,
} = require("./utils/SimpleBook/auth/authenticationSB.js");
const {
  authenticationTTL,
} = require("./utils/TTLock/auth/authenticationTTL.js");
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
const { deletePasscode } = require("./utils/TTLock/deletePasscode.js");
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
    const { booking_id: bookingId, notification_type: notificationType } =
      req.body;

    if ((!bookingId, !notificationType))
      return res.status(400).json("Invalid callback");

    if (notificationType === "create") {
      const { startUnixTime, endUnixTime, clientEmail } =
        await getBookingDetails(bookingId, tokensSB);

      const keyboardPwd = await generatePasscode();

      const { keyboardPwdId } = await postCustomPasscode(
        startUnixTime,
        endUnixTime,
        keyboardPwd,
        clientEmail,
        tokensTTL
      );

      const passcodeData = {
        keyboardPwdId,
        keyboardPwd,
      };

      await setCommentForBooking(bookingId, tokensSB, passcodeData);

      await sendMail(clientEmail, keyboardPwd);

      console.log(
        `[CREATE] Passcode ${keyboardPwd} has been sent to ${clientEmail}`
      );

      return res
        .status(200)
        .json("Passcode generated and email sent successfully");
    } else if (notificationType === "change") {
      const { startUnixTime, endUnixTime, clientEmail, comment } =
        await getBookingDetails(bookingId, tokensSB);

      const { keyboardPwdId, keyboardPwd } = JSON.parse(comment);

      await changePasscodeDetails(
        startUnixTime,
        endUnixTime,
        keyboardPwdId,
        clientEmail,
        tokensTTL
      );

      await sendMail(clientEmail, keyboardPwd);

      console.log(
        `[CHANGE] Passcode ${keyboardPwd} has been sent to ${clientEmail}`
      );

      return res
        .status(200)
        .json("Updated passcode details and email sent successfully");
    } else if (notificationType === "cancel") {
      const { comment } = await getBookingDetails(bookingId, tokensSB);
      const { keyboardPwd, keyboardPwdId } = JSON.parse(comment);
      await deletePasscode(keyboardPwdId, tokensTTL);

      console.log(`[CANCEL] Passcode ${keyboardPwd} has been deleted`);

      return res.status(200).json("Passcode deleted successfully");
    } else {
      return res.status(422).json("Invalid value for notification");
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

    const authDataTTL = await authenticationTTL();
    tokensTTL.accessToken = authDataTTL.access_token;
    tokensTTL.refreshToken = authDataTTL.refresh_token;

    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (error) {
    console.error(error);
  }
}

startServer();
