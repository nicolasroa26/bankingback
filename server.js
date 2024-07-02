const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const stripe = require("stripe")("YOUR_STRIPE_SECRET_KEY");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Conectar a MongoDB
mongoose.connect("mongodb://localhost:27017/restaurant-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Configurar Passport
require("./config/passport")(passport);
app.use(passport.initialize());

// Rutas
app.use("/api/users", require("./routes/users"));
app.use("/api/restaurants", require("./routes/restaurants"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/orders"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
