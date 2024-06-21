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
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-3 shadow">
        <form onSubmit={Update}>
          <h2>Update</h2>
          <div className="mb-3">
            <label htmlFor="" className="form-label">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="" className="form-label">
              DateOfBirth
            </label>
            <input
              type="date"
              placeholder="Enter Birth Day"
              className="form-control"
              value={date_of_birth}
              onChange={(e) => setDate_Of_Birth(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="" className="form-label">
              Nationality
            </label>
            <input
              type="text"
              placeholder="Enter Nationality"
              className="form-control"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="" className="form-label">
              ActiveYears
            </label>
            <input
              type="number"
              placeholder="Enter Active Years"
              className="form-control"
              value={active_years}
              onChange={(e) => setActive_Years(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="" className="form-label">
              Awards
            </label>
            <input
              type="text"
              placeholder="Enter Awards"
              className="form-control"
              value={awards}
              onChange={(e) => setAwards(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="" className="form-label">
              Genre
            </label>
            <input
              type="text"
              placeholder="Enter Genre"
              className="form-control"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>
          <button className="btn btn-primary">Update</button>
        </form>
      </div>
    </div>
  );
}

export default Update;
