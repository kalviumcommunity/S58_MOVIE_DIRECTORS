import React, { useState } from "react";
import axios from "axios";
import Joi from "joi";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

// Define the Joi validation schema with custom messages
const directorJoiSchema = Joi.object({
  name: Joi.string().min(2).max(20).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name should have at least 2 characters",
    "string.max": "Name should have at most 20 characters",
  }),
  date_of_birth: Joi.date().required().messages({
    "date.base": "Date of Birth is required",
  }),
  nationality: Joi.string().min(2).max(30).required().messages({
    "string.empty": "Nationality is required",
    "string.min": "Nationality should have at least 2 characters",
    "string.max": "Nationality should have at most 30 characters",
  }),
  active_years: Joi.number().integer().required().messages({
    "number.base": "Active Years is required and must be a number",
  }),
  awards: Joi.array().items(Joi.string().min(2).max(50)).required().messages({
    "array.base": "Awards are required",
    "string.min": "Each award should have at least 2 characters",
    "string.max": "Each award should have at most 50 characters",
  }),
  genre: Joi.array().items(Joi.string().min(2).max(50)).required().messages({
    "array.base": "Genre is required",
    "string.min": "Each genre should have at least 2 characters",
    "string.max": "Each genre should have at most 50 characters",
  }),
});

function CreateData() {
  const [formData, setFormData] = useState({
    name: "",
    date_of_birth: "",
    nationality: "",
    active_years: "",
    awards: "",
    genre: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const awardsArray = formData.awards.split(",").map((item) => item.trim());
    const genreArray = formData.genre.split(",").map((item) => item.trim());

    const payload = {
      ...formData,
      active_years: Number(formData.active_years),
      awards: awardsArray,
      genre: genreArray,
    };

    const { error } = directorJoiSchema.validate(payload, {
      abortEarly: false,
    });

    if (!error) {
      return null;
    }

    const validationErrors = {};
    for (let detail of error.details) {
      validationErrors[detail.path[0]] = detail.message;
    }
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    const awardsArray = formData.awards.split(",").map((item) => item.trim());
    const genreArray = formData.genre.split(",").map((item) => item.trim());

    const payload = {
      ...formData,
      active_years: Number(formData.active_years),
      awards: awardsArray,
      genre: genreArray,
    };

    try {
      const result = await axios.post(
        "http://localhost:8000/createData",
        payload
      );
      console.log(result);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-3 shadow ">
        <form onSubmit={handleSubmit}>
          <h2>Add User</h2>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter Name"
              className="form-control"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
          </div>
          <div className="mb-3">
            <label htmlFor="date_of_birth" className="form-label">
              Date Of Birth
            </label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              placeholder="Enter Birth Date"
              className="form-control"
              value={formData.date_of_birth}
              onChange={handleInputChange}
              required
            />
            {errors.date_of_birth && (
              <p style={{ color: "red" }}>{errors.date_of_birth}</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="nationality" className="form-label">
              Nationality
            </label>
            <input
              type="text"
              id="nationality"
              name="nationality"
              placeholder="Enter Nationality"
              className="form-control"
              value={formData.nationality}
              onChange={handleInputChange}
              required
            />
            {errors.nationality && (
              <p style={{ color: "red" }}>{errors.nationality}</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="active_years" className="form-label">
              Active Years
            </label>
            <input
              type="number"
              id="active_years"
              name="active_years"
              placeholder="Enter Active Years"
              className="form-control"
              value={formData.active_years}
              onChange={handleInputChange}
              required
            />
            {errors.active_years && (
              <p style={{ color: "red" }}>{errors.active_years}</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="awards" className="form-label">
              Awards
            </label>
            <input
              type="text"
              id="awards"
              name="awards"
              placeholder="Enter Awards "
              className="form-control"
              value={formData.awards}
              onChange={handleInputChange}
              required
            />
            {errors.awards && <p style={{ color: "red" }}>{errors.awards}</p>}
          </div>
          <div className="mb-3">
            <label htmlFor="genre" className="form-label">
              Genre
            </label>
            <input
              type="text"
              id="genre"
              name="genre"
              placeholder="Enter Genre"
              className="form-control"
              value={formData.genre}
              onChange={handleInputChange}
              required
            />
            {errors.genre && <p style={{ color: "red" }}>{errors.genre}</p>}
          </div>
          <button className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default CreateData;
