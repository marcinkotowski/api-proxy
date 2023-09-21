const axios = require("axios");
const { refreshTokenSB } = require("./auth/refreshTokenSB.js");

async function setCommentForBooking(bookingId, Tokens, passcodeData) {
  try {
    const res = await axios.put(
      `${process.env.SIMPLEBOOK_API_URL}/admin/bookings/${bookingId}/comment`,
      { comment: JSON.stringify(passcodeData) },
      {
        headers: {
          "X-Company-Login": process.env.SIMPLEBOOK_COMPANY,
          "X-Token": Tokens.accessToken,
        },
      }
    );

    return res.data;
  } catch (error) {
    if (error.response?.data?.code === 419) {
      const refreshTokens = await refreshTokenSB(Tokens);
      Tokens.accessToken = refreshTokens.token;
      Tokens.refreshToken = refreshTokens.refresh_token;
      return setCommentForBooking(bookingId, Tokens, passcodeData);
    }

    if (error.message) {
      throw new Error("Set comment for booking failed: " + error.message);
    } else {
      throw new Error("Set comment for booking failed: " + error);
    }
  }
}

module.exports = { setCommentForBooking };
