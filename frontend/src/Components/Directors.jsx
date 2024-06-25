import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const DirectorsList = () => {
  const [directors, setDirectors] = useState([]);

  useEffect(() => {
    const fetchDirectors = async () => {
      try {
        const response = await axios.get("http://localhost:8000/data");
        setDirectors(response.data);
      } catch (error) {
        console.error("Error fetching directors:", error);
      }
    };

    fetchDirectors();
  }, []);

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:8000/deleteUser/" + id)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Directors List</h1>
        <Link to="/create">
          <button className="btn btn-primary">Add+</button>
        </Link>
      </div>
      <div className="row">
        {directors.map((users) => (
          <div className="col-md-6 mb-4" key={users._id}>
            <div className="card h-100">
              <div className="card-body">
                <h2 className="card-title">{users.name}</h2>
                <p className="card-text">
                  <strong>Date of Birth:</strong> {users.date_of_birth}
                </p>
                <p className="card-text">
                  <strong>Nationality:</strong> {users.nationality}
                </p>
                <p className="card-text">
                  <strong>Active Years:</strong> {users.active_years}
                </p>
                <p className="card-text">
                  <strong>Awards:</strong> {users.awards.join(", ")}
                </p>
                <p className="card-text">
                  <strong>Genre:</strong> {users.genre.join(", ")}
                </p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <Link to={`/update/${users._id}`}>
                  <button className="btn btn-warning">Update</button>
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={(e) => handleDelete(users._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DirectorsList;
