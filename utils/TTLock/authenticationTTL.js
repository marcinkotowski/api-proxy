const axios = require("axios");

async function authenticationTTL() {
  try {
    const res = await axios.post(
      `${process.env.TTLOCK_API_URL}/oauth2/token`,
      {
        clientId: process.env.TTLOCK_CLIENT_ID,
        clientSecret: process.env.TTLOCK_CLIENT_SECRET,
        username: process.env.TTLOCK_USERNAME,
        password: process.env.TTLOCK_PASSWORD,
      },
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    return res.data;
  } catch (error) {
    throw new Error("authenticationTTL failed: " + error.message);
  }
}

module.exports = { authenticationTTL };
