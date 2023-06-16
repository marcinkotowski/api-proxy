const axios = require("axios");

async function changePasscodeDetails(
  startUnixTime,
  endUnixTime,
  keyboardPwdId,
  clientEmail
) {
  try {
    const res = await axios.post(
      `${process.env.TTLOCK_API_URL}/v3/keyboardPwd/change`,
      {
        clientId: process.env.TTLOCK_CLIENT_ID,
        accessToken: process.env.TTLOCK_ACCESS_TOKEN,
        lockId: process.env.TTLOCK_LOCK_ID,
        keyboardPwdId,
        keyboardPwdName: clientEmail,
        startDate: startUnixTime,
        endDate: endUnixTime,
        deleteType: 2,
        date: new Date().getTime(),
      },
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    return res.data;
  } catch (error) {
    throw new Error("Change passcode details failed: " + error);
  }
}

module.exports = { changePasscodeDetails };
