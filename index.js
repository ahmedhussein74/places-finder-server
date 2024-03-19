require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const bodyParser = require("body-parser");
const PlacetRoute = require("./routes/PlacesRoute");

// create express app
const app = express();

// middle wares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/places", PlacetRoute);

//run the application
app.listen(process.env.PORT, () => {
  console.log(`Server listining on port: ${process.env.PORT}`);
});
