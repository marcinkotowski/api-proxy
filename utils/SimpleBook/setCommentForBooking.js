const axios = require("axios");
const { refreshToken } = require("./refreshToken.js");

async function setCommentForBooking(bookingId, tokens, passcodeId) {
  try {
    const res = await axios.put(
      `${process.env.SIMPLEBOOK_API_URL}/admin/bookings/${bookingId}/comment`,
      { comment: passcodeId },
      {
        headers: {
          "X-Company-Login": process.env.SIMPLEBOOK_COMPANY,
          "X-Token": tokens.accessToken,
        },
      }
    );

    return res.data;
  } catch (error) {
    if (error.response?.data?.code === 419) {
      const refreshTokens = await refreshToken(tokens);
      tokens.accessToken = refreshTokens.token;
      tokens.refreshToken = refreshTokens.refresh_token;
      return setCommentForBooking(bookingId, tokens, bookingData);
    }
    throw new Error("Set comment for booking failed: " + error.message);
  }
}

module.exports = { setCommentForBooking };
