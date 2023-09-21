const axios = require("axios");

async function refreshTokenTTL(Tokens) {
  try {
    const res = await axios.post(
      `${process.env.TTLOCK_API_URL}/oauth2/token`,
      {
        clientId: process.env.TTLOCK_CLIENT_ID,
        clientSecret: process.env.TTLOCK_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: Tokens.refreshToken,
      },
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    return res.data;
  } catch (error) {
    if (error.message) {
      throw new Error("refreshTokenTTL failed: " + error.message);
    } else {
      throw new Error("refreshTokenTTL failed: " + error);
    }
  }
}

module.exports = { refreshTokenTTL };
