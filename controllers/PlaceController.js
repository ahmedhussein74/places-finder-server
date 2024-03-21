const axios = require("axios");
const { cleanData } = require("../middlewares/cleaningData");

exports.getCities = async (req, res) => {
  try {
    const { countryCode, adminCode1 } = req.params;
    const baseUrl = "http://api.geonames.org/searchJSON";
    const username = "taweeq";
    const response = await axios.get(
      `${baseUrl}?username=${username}&style=short&maxRows=1000&featureClass=A&featureClass=P&country=${countryCode}&adminCode1=${adminCode1}`
    );
    if (response.data.geonames && response.data.geonames.length > 0) {
      let cities = response.data.geonames.map((city) => city.name);
      cities = await cleanData(cities);
      console.log(cities.length);
      res.status(200).json(cities);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.getPlaces = async (req, res) => {
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
};

exports.getPlaceDetails = async (req, res) => {
  try {
    const key = process.env.API_KEY;
    const placeId = req.params.id;
    const fields =
      "name,place_id,formatted_address,url,formatted_phone_number,website,types,business_status,opening_hours,rating,user_ratings_total,photos,reviews";
    const baseUrl = "https://maps.googleapis.com/maps/api/place/details/json";
    const params = {
      placeid: placeId,
      fields,
      key: key,
    };
    const response = await axios.get(baseUrl, { params });
    res.send(response.data.result);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error occurred while fetching place details.");
  }
};
