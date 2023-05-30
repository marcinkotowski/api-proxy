const axios = require("axios");
const { refreshToken } = require("./refreshToken.js");

async function bookingDetails(bookingId, Tokens) {
  try {
    const res = await axios.get(
      `${process.env.SIMPLEBOOK_API_URL}/admin/bookings/${bookingId}`,
      {
        headers: {
          "X-Company-Login": process.env.SIMPLEBOOK_COMPANY,
          "X-Token": Tokens.accessToken,
        },
      }
    );

    const {
      start_datetime: startDateTime,
      end_datetime: endDateTime,
      client: { email: clientEmail },
    } = res.data;

    // Convert 'YYYY-MM-DD HH:mm:ss' to UNIX Time
    const startUnixTime = new Date(startDateTime).getTime();
    const endUnixTime = new Date(endDateTime).getTime();

    return { startUnixTime, endUnixTime, clientEmail };
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
