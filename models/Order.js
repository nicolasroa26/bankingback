const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  dishes: [
    {
      dish: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, required: true, default: "Pending" },
});
module.exports = mongoose.model("Order", OrderSchema);
