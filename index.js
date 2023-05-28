const express = require("express");
const helmet = require("helmet");
const { Authentication } = require("./utils/SimpleBook/authentication.js");
const { bookingDetails } = require("./utils/SimpleBook/bookingDetails.js");
require("dotenv").config({ override: true });

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(helmet());

const SimpleBookTokens = {
  accessToken: null,
  refreshToken: null,
};

app.post("/generate-passcode", async (req, res) => {
  try {
    const { booking_id: bookingId } = req.body;
    if (!bookingId) return res.status(400).json("Invalid callback");

    const {
      start_datetime: startDateTime,
      end_datetime: endDateTime,
      client: { email: clientEmail },
    } = await bookingDetails(bookingId, SimpleBookTokens);

    console.log(startDateTime, endDateTime, clientEmail);
    console.log(SimpleBookTokens.accessToken, SimpleBookTokens.refreshToken);

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

async function startServer() {
  try {
    const authData = await Authentication();
    SimpleBookTokens.accessToken = authData.token;
    SimpleBookTokens.refreshToken = authData.refresh_token;
    console.log(SimpleBookTokens.accessToken, SimpleBookTokens.refreshToken);

    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (error) {
    console.error(error);
  }
}

startServer();
