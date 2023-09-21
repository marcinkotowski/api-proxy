const axios = require("axios");

async function refreshTokenSB(Tokens) {
  try {
    const res = await axios.post(
      `${process.env.SIMPLEBOOK_API_URL}/admin/auth/refresh-token`,
      {
        company: process.env.SIMPLEBOOK_COMPANY,
        refresh_token: Tokens.refreshToken,
      }
    );

    return res.data;
  } catch (error) {
    if (error.message) {
      throw new Error("refreshTokenSB failed: " + error.message);
    } else {
      throw new Error("refreshTokenSB failed: " + error);
    }
  }
}

module.exports = { refreshTokenSB };
