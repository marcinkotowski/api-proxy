const axios = require("axios");

async function Authentication() {
  try {
    const res = await axios.post(
      `${process.env.SIMPLEBOOK_API_URL}/admin/auth`,
      {
        company: process.env.COMPANY,
        login: process.env.LOGIN,
        password: process.env.PASSWORD,
      }
    );

    return res.data;
  } catch (error) {
    throw new Error("Authentication failed: " + error.message);
  }
}

module.exports = { Authentication };
