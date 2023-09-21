const axios = require("axios");
const moment = require("moment-timezone");
const { refreshTokenTTL } = require("./auth/refreshTokenTTL");

async function deletePasscode(keyboardPwdId, Tokens) {
  try {
    const res = await axios.post(
      `${process.env.TTLOCK_API_URL}/v3/keyboardPwd/delete`,
      {
        clientId: process.env.TTLOCK_CLIENT_ID,
        accessToken: Tokens.accessToken,
        lockId: process.env.TTLOCK_LOCK_ID,
        keyboardPwdId,
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
      return deletePasscode(keyboardPwdId, Tokens);
    }

    return res.data;
  } catch (error) {
    if (error.message) {
      throw new Error("Delete passcode failed: " + error.message);
    } else {
      throw new Error("Delete passcode failed: " + error);
    }
  }
}

module.exports = { deletePasscode };
