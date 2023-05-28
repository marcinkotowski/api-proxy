const axios = require("axios");

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
    throw new Error("Get booking details failed: " + error.message);
  }
}

module.exports = { bookingDetails };
