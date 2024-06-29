import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setMessage(
        "Password must be at least 8 characters long, include at least one letter, one number, and one special character (@, #, $)."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/login",
        {
          username,
          password,
        },
        { withCredentials: true }
      );
      console.log(response.data);
      setIsLoggedIn(true);
      setMessage("Successfully logged in!");

      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data?.message || error.message
      );
      setMessage("Login failed. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex vh-100 bg-light justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-4 shadow-sm">
        {message && (
          <div className="alert alert-info text-center"> {message} </div>
        )}
        <form onSubmit={handleLogin}>
          <h2 className="text-center mb-4" style={{ color: "#6c757d" }}>
            Login
          </h2>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoggedIn || loading}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoggedIn || loading}
            />
          </div>
          <div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoggedIn || loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
