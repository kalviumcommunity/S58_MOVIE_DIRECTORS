import React, { useState, useEffect } from "react";
import axios from "axios";

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

  return (
    <div>
      <h1>Directors List</h1>
      <ul>
        {directors.map((director) => (
          <li key={director._id}>
            <h2>{director.name}</h2>
            <p>Date of Birth: {director.date_of_birth}</p>
            <p>Nationality: {director.nationality}</p>
            <p>Active Years: {director.active_years}</p>
            <p>Notable Films: {director.notable_films.join(", ")}</p>
            <p>Awards: {director.awards.join(", ")}</p>
            <p>
              Genre Specialization: {director.genre_specialization.join(",")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DirectorsList;
