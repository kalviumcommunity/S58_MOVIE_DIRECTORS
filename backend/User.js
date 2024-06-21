const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
});

const UserModel = mongoose.model("hello", userSchema);

module.exports = UserModel;
