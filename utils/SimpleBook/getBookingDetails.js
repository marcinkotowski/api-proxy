const axios = require("axios");
const moment = require("moment-timezone");
const { refreshTokenSB } = require("./auth/refreshTokenSB.js");

async function getBookingDetails(bookingId, Tokens) {
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
      comment,
    } = res.data;

    // Convert 'YYYY-MM-DD HH:mm:ss' to UNIX Time
    const startUnixTime = moment
      .tz(startDateTime, process.env.TIMEZONE)
      .valueOf();
    const endUnixTime = moment.tz(endDateTime, process.env.TIMEZONE).valueOf();

    return { startUnixTime, endUnixTime, clientEmail, comment };
  } catch (error) {
    if (error.response?.data?.code === 419) {
      const refreshTokens = await refreshTokenSB(Tokens);
      Tokens.accessToken = refreshTokens.token;
      Tokens.refreshToken = refreshTokens.refresh_token;
      return getBookingDetails(bookingId, Tokens);
    }

    if (error.message) {
      throw new Error("Get booking details failed: " + error.message);
    } else {
      throw new Error("Get booking details failed: " + error);
    }
  }
}

module.exports = { getBookingDetails };
