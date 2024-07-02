const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  googleId: { type: String },
  facebookId: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
});
module.exports = mongoose.model("User", UserSchema);
