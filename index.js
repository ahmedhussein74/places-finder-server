require("dotenv").config();
const cors = require("cors");
const axios = require("axios");
const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const bodyParser = require("body-parser");

// create express app
const app = express();

// middle wares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/places", async (req, res) => {
  const { country, city, category } = req.query;
  const query = `${category} in ${city},${country}`;
  const key = process.env.API_KEY;
  const baseUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json";
  const params = {
    query,
    key,
  };

  try {
    let results = [];
    let nextPageToken = null;
    do {
      const res = await axios.get(baseUrl, { params });
      results.push(...res.data.results);
      nextPageToken = res.data.next_page_token;
      params.pagetoken = nextPageToken;
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } while (nextPageToken);
    res.status(200).json(results);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch data from Google Places API" });
  }
});

//run the application
app.listen(process.env.PORT, () => {
  console.log(`Server listining on port: ${process.env.PORT}`);
});
