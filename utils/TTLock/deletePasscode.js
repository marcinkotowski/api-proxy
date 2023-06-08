const axios = require("axios");

async function deletePasscode(keyboardPwdId) {
  try {
    const res = await axios.post(
      `${process.env.TTLOCK_API_URL}/v3/keyboardPwd/delete`,
      {
        clientId: process.env.TTLOCK_CLIENT_ID,
        accessToken: process.env.TTLOCK_ACCESS_TOKEN,
        lockId: process.env.TTLOCK_LOCK_ID,
        keyboardPwdId,
        deleteType: 2,
        date: new Date().getTime(),
      },
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    return res.data;
  } catch (error) {
    throw new Error("Delete passcode failed: " + error);
  }
}

module.exports = { deletePasscode };
