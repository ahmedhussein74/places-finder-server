const router = require("express").Router();

const place = require("../controllers/PlaceController");

router.get("/", place.getPlaces);

router.get("/:id", place.getPlaceDetails);

router.get("/cities/:countryCode/:adminCode1", place.getCities);

module.exports = router;
