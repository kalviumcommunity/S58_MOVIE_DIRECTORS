import { useState, useEffect } from "react";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DirectorsList from "./Components/Directors";
import CreateData from "./Components/CreateData";
import Update from "./Components/Update";
import Login from "./Components/Login";
import Logout from "./Components/Logout";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DirectorsList />} />
          <Route path="/create" element={<CreateData />} />
          <Route path="/update/:id" element={<Update />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
