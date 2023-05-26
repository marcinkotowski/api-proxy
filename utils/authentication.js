const axios = require("axios");

async function Authentication() {
  try {
    const res = await axios.post(
      "https://user-api-v2.simplybook.me/admin/auth",
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
