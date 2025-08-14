import React from 'react';
import './LandingPage.css';
import AnimalCard from '../Card/AnimalCard';

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="hero-section">
        <h1 className="landing-title">BEAST BUDDY</h1>
        <h2 className="landing-subtitle">Unleash Your Inner Beast!</h2>
        <p className="landing-description">
          Take our fun personality quiz and discover your spirit animal.
        </p>
        <button className="cta-button">Find Your Beast</button>
      </div>
      <div className="animal-section">
        <AnimalCard />
      </div>
    </div>
  );
}

export default LandingPage;
