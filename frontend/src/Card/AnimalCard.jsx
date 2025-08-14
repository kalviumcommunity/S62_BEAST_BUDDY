/* eslint-disable no-unused-vars */
import React from "react";
import "./AnimalCard.css"; // Import CSS file

const AnimalCard = () => {
  return (
    <div className="animal-card-container">
      <div className="animal-card">
        <h2 className="animal-title">Lion</h2>
        <p className="animal-subtitle">King Of The Jungle</p>
        <p className="animal-traits">Traits: Strong, Ferocious, Royal</p>
      </div>

      <div className="animal-card">
        <h2 className="animal-title">Tiger</h2>
        <p className="animal-subtitle">Powerful and Stealthy</p>
        <p className="animal-traits">Traits: Agile, Fierce, Independent</p>
      </div>

      <div className="animal-card">
        <h2 className="animal-title">Eagle</h2>
        <p className="animal-subtitle">Majestic Sky Hunter</p>
        <p className="animal-traits">Traits: Visionary, Free, Determined</p>
      </div>

      <div className="animal-card">
        <h2 className="animal-title">Wolf</h2>
        <p className="animal-subtitle">Loyal and Wise</p>
        <p className="animal-traits">Traits: Courageous, Social, Intelligent</p>
      </div>
    </div>
  );
};

export default AnimalCard;
