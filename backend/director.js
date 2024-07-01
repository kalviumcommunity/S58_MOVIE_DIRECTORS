const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const directorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  active_years: {
    type: Number,
    required: true,
  },
  awards: {
    type: [String],
    required: true,
  },
  genre: {
    type: [String],
    required: true,
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const directorJoiSchema = Joi.object({
  name: Joi.string().min(2).max(20).required(),
  date_of_birth: Joi.date().required(),
  nationality: Joi.string().min(2).max(30).required(),
  active_years: Joi.number().integer().required(),
  awards: Joi.array().items(Joi.string().min(2).max(50)).required(),
  genre: Joi.array().items(Joi.string().min(2).max(50)).required(),
  created_by: Joi.string().required(),
});

directorSchema.methods.joiValidate = function (obj) {
  return directorJoiSchema.validate(obj, { abortEarly: false });
};

const DirectorModel = mongoose.model("Director", directorSchema);

module.exports = DirectorModel;
