const axios = require("axios");
const world = require("../database/world");

exports.getStates = async (req, res) => {
  const code = req.params.iso2;
  try {
    const filteredCountries = world.filter((element) => element.iso2 === code);
    if (filteredCountries.length === 0) {
      return res.status(404).json({ error: "Country not found" });
    }
    return res.status(200).json({ states: filteredCountries[0].states });
  } catch (error) {
    console.error("Error while fetching cities:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getCities = async (req, res) => {
  const { iso2, sc } = req.query;
  try {
    const country = world.find((country) => country.iso2 === iso2);
    if (!country) {
      console.log("Country not found");
      return res.status(404).json({ error: "Country not found" });
    }
    const state = country.states.find((state) => state.sc === sc);
    if (!state) {
      console.log("State not found");
      return res.status(404).json({ error: "State not found" });
    }
    console.log("State found:", state);
    return res.status(200).json({ cities: state.cities });
  } catch (error) {
    console.error("Error while fetching cities:", error);
    return res.status(500).json({ error: "Internal Server Error" });
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
