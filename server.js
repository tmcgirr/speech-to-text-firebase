const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = "d4a4604322f64eeaab6c95064a29c30c";

app.get("/", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.assemblyai.com/v2/realtime/token", // use account token to get a temp user token
      { expires_in: 3600 }, // can set a TTL timer in seconds.
      { headers: { authorization: API_KEY } }
      // { headers: { authorization: process.env.SERVER_API_KEY } }
    );
    const { data } = response;
    res.json(data);
  } catch (error) {
    const {
      response: { status, data },
    } = error;
    res.status(status).json(data);
  }
});

app.set("port", process.env.PORT || 8000);
const server = app.listen(app.get("port"), () => {
  // const server = app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on port ${server.address().port}`);
});
