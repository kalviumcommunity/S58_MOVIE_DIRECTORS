import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Update() {
  const { id } = useParams();
  const [name, setName] = useState();
  const [date_of_birth, setDate_Of_Birth] = useState();
  const [nationality, setNationality] = useState();
  const [active_years, setActive_Years] = useState();
  const [awards, setAwards] = useState();
  const [genre, setGenre] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/getUser/" + id)
      .then((result) => {
        console.log(result);
        setName(result.data.name);
        setDate_Of_Birth(result.data.date_of_birth);
        setNationality(result.data.nationality);
        setActive_Years(result.data.active_years);
        setAwards(result.data.awards);
        setGenre(result.data.genre);
      })
      .catch((err) => console.log(err));
  }, []);

  const Update = (e) => {
    e.preventDefault();

    axios
      .put("http://localhost:8000/UpdateUser/" + id, {
        name,
        date_of_birth,
        nationality,
        active_years,
        awards,
        genre,
      })
      .then((result) => {
        console.log(result);
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex vh-100 bg-light justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-4 shadow-sm">
        <form onSubmit={Update}>
          <h2 className="text-center mb-4" style={{ color: "#6c757d" }}>
            Update Director
          </h2>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter Name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="date_of_birth" className="form-label">
              Date of Birth
            </label>
            <input
              type="date"
              id="date_of_birth"
              placeholder="Enter Birth Date"
              className="form-control"
              value={date_of_birth}
              onChange={(e) => setDate_Of_Birth(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="nationality" className="form-label">
              Nationality
            </label>
            <input
              type="text"
              id="nationality"
              placeholder="Enter Nationality"
              className="form-control"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="active_years" className="form-label">
              Active Years
            </label>
            <input
              type="number"
              id="active_years"
              placeholder="Enter Active Years"
              className="form-control"
              value={active_years}
              onChange={(e) => setActive_Years(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="awards" className="form-label">
              Awards
            </label>
            <input
              type="text"
              id="awards"
              placeholder="Enter Awards (comma-separated)"
              className="form-control"
              value={awards}
              onChange={(e) => setAwards(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="genre" className="form-label">
              Genre
            </label>
            <input
              type="text"
              id="genre"
              placeholder="Enter Genre (comma-separated)"
              className="form-control"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default Update;
