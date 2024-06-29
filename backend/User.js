const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const Joi = require("joi");

const userValidationSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@#$]).{8,}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long, include at least one letter, one number, and one special character (@, #, $).",
    }),
});

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre("validate", function (next) {
  const { error } = userValidationSchema.validate({
    username: this.username,
    password: this.password,
  });
  if (error) {
    next(new Error(error.details[0].message));
  } else {
    next();
  }
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
