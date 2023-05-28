const axios = require("axios");

async function refreshToken(Tokens) {
  try {
    const res = await axios.post(
      `${process.env.SIMPLEBOOK_API_URL}/admin/auth/refresh-token`,
      {
        company: process.env.COMPANY,
        refresh_token: Tokens.refreshToken,
      }
    );

    return res.data;
  } catch (error) {
    throw new Error("Refresh token failed: " + error.message);
  }
}

module.exports = { refreshToken };
