import React from "react";
import data from "./data.json";

function Profile() {
  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {data.name}</p>
      <p>Date of Birth: {data.date_of_birth}</p>
      <p>Nationality: {data.nationality}</p>
      <p>Active Years: {data.active_years}</p>
      <p>Notable Films: {data.notable_films.join(", ")}</p>
      <p>Awards: {data.awards.join(", ")}</p>
      <p>Genre Specialization: {data.genre_specialization.join(", ")}</p>
    </div>
  );
}

export default Profile;
