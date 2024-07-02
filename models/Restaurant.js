const mongoose = require("mongoose");
const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dish" }],
});
module.exports = mongoose.model("Restaurant", RestaurantSchema);
