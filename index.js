const express = require("express");
const helmet = require("helmet");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(helmet());

app.post("/generate-passcode", async (req, res) => {
  try {
    // Fetch booking_id and booking_hash
    const { booking_id, booking_hash } = req.body;
    if (!booking_id || !booking_hash)
      return res.status(400).json("Invalid callback");
    res.status(200).json({ booking_id, booking_hash });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
