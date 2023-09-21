const axios = require("axios");
const moment = require("moment-timezone");
const { refreshTokenTTL } = require("./auth/refreshTokenTTL");

async function changePasscodeDetails(
  startUnixTime,
  endUnixTime,
  keyboardPwdId,
  clientEmail,
  Tokens
) {
  try {
    const res = await axios.post(
      `${process.env.TTLOCK_API_URL}/v3/keyboardPwd/change`,
      {
        clientId: process.env.TTLOCK_CLIENT_ID,
        accessToken: Tokens.accessToken,
        lockId: process.env.TTLOCK_LOCK_ID,
        keyboardPwdId,
        keyboardPwdName: clientEmail,
        startDate: startUnixTime,
        endDate: endUnixTime,
        deleteType: 2,
        date: moment().tz(process.env.TIMEZONE).valueOf(),
      },
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    if (res.data.errcode === 10003 || res.data.errcode === 10004) {
      const refreshTokens = await refreshTokenTTL(Tokens);
      Tokens.accessToken = refreshTokens.access_token;
      Tokens.refreshToken = refreshTokens.refresh_token;
      return changePasscodeDetails(
        startUnixTime,
        endUnixTime,
        keyboardPwdId,
        clientEmail,
        Tokens
      );
    }

    return res.data;
  } catch (error) {
    if (error.message) {
      throw new Error("Change passcode details failed: " + error.message);
    } else {
      throw new Error("Change passcode details failed: " + error);
    }
  }
}

module.exports = { changePasscodeDetails };
