const crypto = require("crypto");

async function generatePasscode() {
  try {
    let passcode = "";
    for (let i = 0; i < 6; i++) {
      const digit = crypto.randomInt(0, 10);
      passcode += digit.toString();
    }

    return passcode;
  } catch (error) {
    throw new Error("generatePasscode failed: " + error.message);
  }
}

module.exports = { generatePasscode };
