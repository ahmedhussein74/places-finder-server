const router = require("express").Router();

const place = require("../controllers/PlaceController");

router.get("/", place.getPlaces);

router.get("/:id", place.getPlaceDetails);

router.get("/governments/:iso2", place.getGovernments);

router.get("/cities/:iso2/:sc", place.getCities);

module.exports = router;
