// src/components/LandingPage.js
// Current landing page for Carbon Footprint Tracker

import React from 'react';
import './LandingPage.css';
import EarthRecycle from '../assets/Earth-Recycle.jpg';

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="navbar">
        <h1>Carbon Footprint Tracker</h1>
        <nav>
          <ul>
            {/* Discuss with group and see what these should be. */}
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Sign Up</a></li>
            <li><a href="#signup">Log In</a></li>
          </ul>
        </nav>
      </header>

      <section className="hero-section">
        <h2>Track Your Carbon Footprint</h2>
        <p>Take the first step in reducing your environmental impact today.</p>
        <button>Get Started</button>
        {/* Image placed here. May change in the future. */}
        <img src={EarthRecycle} alt="Description of the image" className="landing-image" />
      </section>

      <section id="features" className="features-section">
        <h3>Our Features</h3>
        <ul>
        {/* Update features list later. */}
          <li>Track your daily carbon footprint</li>
          <li>Monitor progress over time with graphs</li>
          <li>Receive personalized tips to reduce emissions</li>
        </ul>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Carbon Footprint Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
