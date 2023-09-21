const axios = require("axios");

async function authenticationSB() {
  try {
    const res = await axios.post(
      `${process.env.SIMPLEBOOK_API_URL}/admin/auth`,
      {
        company: process.env.SIMPLEBOOK_COMPANY,
        login: process.env.SIMPLEBOOK_LOGIN,
        password: process.env.SIMPLEBOOK_PASSWORD,
      }
    );

    return res.data;
  } catch (error) {
    if (error.message) {
      throw new Error("authenticationSB failed: " + error.message);
    } else {
      throw new Error("authenticationSB failed: " + error);
    }
  }
}

module.exports = { authenticationSB };
