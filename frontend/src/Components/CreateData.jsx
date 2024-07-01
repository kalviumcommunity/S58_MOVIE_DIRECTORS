import React, { useState, useEffect } from "react";
import axios from "axios";
import Joi from "joi";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

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
  created_by: Joi.string().required(),
});

function CreateData() {
  const [formData, setFormData] = useState({
    name: "",
    date_of_birth: "",
    nationality: "",
    active_years: "",
    awards: [],
    genre: [],
    created_by: "", // Initialize created_by field
  });

  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/users", {
          withCredentials: true,
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

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

    console.log("Payload before sending:", payload); // Verify payload

    try {
      const result = await axios.post(
        "http://localhost:8000/createData",
        payload,
        { withCredentials: true }
      );
      console.log(result);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized access:", error.response.data.message);
      } else {
        console.error("Error creating data:", error);
      }
    }
  };

  return (
    <div className="d-flex vh-100 bg-light justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-4 shadow-sm">
        <form onSubmit={handleSubmit}>
          <h2 className="text-center mb-4" style={{ color: "#6c757d" }}>
            Add Director
          </h2>
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
            {errors.name && <p className="text-danger">{errors.name}</p>}
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
              <p className="text-danger">{errors.date_of_birth}</p>
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
              <p className="text-danger">{errors.nationality}</p>
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
              <p className="text-danger">{errors.active_years}</p>
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
              placeholder="Enter Awards (comma-separated)"
              className="form-control"
              value={formData.awards}
              onChange={handleInputChange}
              required
            />
            {errors.awards && <p className="text-danger">{errors.awards}</p>}
          </div>
          <div className="mb-3">
            <label htmlFor="genre" className="form-label">
              Genre
            </label>
            <input
              type="text"
              id="genre"
              name="genre"
              placeholder="Enter Genre (comma-separated)"
              className="form-control"
              value={formData.genre}
              onChange={handleInputChange}
              required
            />
            {errors.genre && <p className="text-danger">{errors.genre}</p>}
          </div>
          <div className="mb-3">
            <label htmlFor="created_by" className="form-label">
              Created By
            </label>
            <select
              id="created_by"
              name="created_by"
              className="form-control"
              value={formData.created_by}
              onChange={handleInputChange}
              required
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>
            {errors.created_by && (
              <p className="text-danger">{errors.created_by}</p>
            )}
          </div>
          <button className="btn btn-primary w-100">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default CreateData;
