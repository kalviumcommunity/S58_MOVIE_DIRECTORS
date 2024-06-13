import React from "react";
import data from "../data.json";
import "./Directors.css";

function MovieDirector({
  name,
  date_of_birth,
  nationality,
  active_years,
  notable_films,
  awards,
  genre_specialization,
}) {
  return (
    <div className="container">
      <div className="box">
        <h2>Movie Directors</h2>
        <h4>{name}</h4>
        <p>Date of Birth: {date_of_birth}</p>
        <p>Nationality: {nationality}</p>
        <p>Active Years: {active_years}</p>
        {notable_films && <p>Notable Films: {notable_films.join(", ")}</p>}
        {awards && <p>Awards: {awards.join(", ")}</p>}
        {genre_specialization && (
          <p>Genre Specialization: {genre_specialization.join(", ")}</p>
        )}
      </div>
    </div>
  );
}

function Directors() {
  return (
    <div>
      {data.directors.map((director, index) => (
        <MovieDirector key={index} {...director} />
      ))}
    </div>
  );
}

export default Directors;
