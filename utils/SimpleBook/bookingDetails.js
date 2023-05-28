const axios = require("axios");
const { refreshToken } = require("./refreshToken.js");

async function bookingDetails(bookingId, Tokens) {
  try {
    const res = await axios.get(
      `${process.env.SIMPLEBOOK_API_URL}/admin/bookings/${bookingId}`,
      {
        headers: {
          "X-Company-Login": process.env.COMPANY,
          "X-Token": Tokens.accessToken,
        },
      }
    );

    console.log(res.data);

    return res.data;
  } catch (error) {
    if (error.response?.data?.code === 419) {
      const refreshTokens = await refreshToken(Tokens);
      Tokens.accessToken = refreshTokens.token;
      Tokens.refreshToken = refreshTokens.refresh_token;
      return bookingDetails(bookingId, Tokens);
    }
    throw new Error("Get booking details failed: " + error.message);
  }
}

module.exports = { bookingDetails };
