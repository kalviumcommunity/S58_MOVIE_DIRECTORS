import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const DirectorsList = () => {
  const [directors, setDirectors] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDirectors = async () => {
      try {
        const response = await axios.get("http://localhost:8000/data", {
          withCredentials: true,
        });
        setDirectors(response.data);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error fetching directors:", error);
      }
    };

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
    fetchDirectors();
    fetchUsers();
  }, []);

  const filteredDirectors = directors.filter(
    (director) =>
      director.name &&
      director.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedUser ? director.created_by === selectedUser : true)
  );

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:8000/deleteUser/" + id)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const handleLogout = async () => {
    try {
      const response = await axios.delete("http://localhost:8000/logout", {
        withCredentials: true,
      });
      console.log(response.data);
      setIsLoggedIn(false);
      setDirectors([]);
      setMessage("Successfully logged out");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error(
        "Logout error:",
        error.response?.data?.message || error.message
      );
      setMessage("Logout failed. Please try again");
    }
  };

  return (
    <div className="container mt-5">
      {message && <div className="alert alert-danger">{message}</div>}
      <div className="mb-4">
        <input
          className="form-control"
          type="text"
          placeholder="Search Directors"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0" style={{ color: "#6c757d" }}>
          Directors List
        </h1>
        <div>
          <Link to="/create">
            <button className="btn btn-primary me-2">Add+</button>
          </Link>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button className="btn btn-primary">LogIn</button>
            </Link>
          )}
        </div>
      </div>
      <div className="row">
        {filteredDirectors.map((director) => (
          <div className="col-md-6 mb-4" key={director._id}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <h2 className="card-title" style={{ color: "#6c757d" }}>
                  {director.name}
                </h2>
                <p className="card-text">
                  <strong>Date of Birth:</strong> {director.date_of_birth}
                </p>
                <p className="card-text">
                  <strong>Nationality:</strong> {director.nationality}
                </p>
                <p className="card-text">
                  <strong>Active Years:</strong> {director.active_years}
                </p>
                <p className="card-text">
                  <strong>Awards:</strong> {director.awards.join(", ")}
                </p>
                <p className="card-text">
                  <strong>Genre:</strong> {director.genre.join(", ")}
                </p>
              </div>
              <div className="card-footer bg-white border-0 d-flex justify-content-between">
                <Link to={`/update/${director._id}`}>
                  <button className="btn btn-warning">Update</button>
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(director._id)}
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
