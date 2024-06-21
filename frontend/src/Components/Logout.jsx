import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:8000/logout");
      console.log(response.data);
      navigate("/"); // Redirect to home or login page after logout
    } catch (error) {
      console.error("Logout error:", error.response.data.message);
    }
  };

  return (
    <div className="container mt-5">
      <button onClick={handleLogout} className="btn btn-danger">
        Logout
      </button>
    </div>
  );
}

export default Logout;
