const crypto = require("crypto");

async function generatePasscode() {
  try {
    let passcode = "";
    for (let i = 0; i < 7; i++) {
      const digit = crypto.randomInt(0, 10);
      passcode += digit.toString();
    }

    return passcode;
  } catch (error) {
    if (error.message) {
      throw new Error("generatePasscode failed: " + error.message);
    } else {
      throw new Error("generatePasscode failed: " + error);
    }
  }
}

module.exports = { generatePasscode };
