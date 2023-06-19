const axios = require("axios");
const moment = require("moment-timezone");

async function postCustomPasscode(
  startUnixTime,
  endUnixTime,
  keyboardPwd,
  clientEmail
) {
  try {
    const res = await axios.post(
      `${process.env.TTLOCK_API_URL}/v3/keyboardPwd/add`,
      {
        clientId: process.env.TTLOCK_CLIENT_ID,
        accessToken: process.env.TTLOCK_ACCESS_TOKEN,
        lockId: process.env.TTLOCK_LOCK_ID,
        keyboardPwd,
        keyboardPwdName: clientEmail,
        startDate: startUnixTime,
        endDate: endUnixTime,
        addType: 2,
        date: moment().tz(process.env.TIMEZONE).valueOf(),
      },
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    return res.data;
  } catch (error) {
    throw new Error("Post custom passcode failed: " + error);
  }
}

module.exports = { postCustomPasscode };
