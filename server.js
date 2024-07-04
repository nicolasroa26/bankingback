const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const stripe = require("stripe")(
  "sk_test_51PXxKbHEpkFeHCWbAxkHElUquKPl0vU3KmV8X46tlMJ6AYUHSyb81AXtuC8UFIrvWoM9xJhLEAlIsxZxPdCIMHyc00JpQnuogX"
);
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://jortiz:gbJw0LGQRC756CWM@clusterrestaurant.l5s5out.mongodb.net/?retryWrites=true&w=majority&appName=ClusterRestaurant";

mongoose
  .connect(uri)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

require("./config/passport")(passport);
app.use(passport.initialize());

app.use("/api/users", require("./routes/users"));
app.use("/api/restaurants", require("./routes/restaurants"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/orders"));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
