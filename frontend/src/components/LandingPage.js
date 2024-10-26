// src/components/LandingPage.js
// Current landing page for Carbon Footprint Tracker

import React from 'react';
import './LandingPage.css';
import EarthRecycle from '../assets/Earth-Recycle.jpg';
import Footer from './Footer';
import Navbar from './Navbar'; 
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar /> 
      
      <section className="hero-section">
        <h2>Track Your Carbon Footprint</h2>
        <p>Take the first step in reducing your environmental impact today.</p>
        <Link to="/signup">
          <button>Get Started</button>
        </Link>
        {/* Image placed here. May change in the future. */}
        <img src={EarthRecycle} alt="Earth recycling symbol" className="landing-image" />
      </section>

      <section id="features" className="features-section">
        <h3>Our Features</h3>
        <ul>
          <li>Track your daily carbon footprint</li>
          <li>Monitor progress over time with graphs</li>
          <li>Receive personalized tips to reduce emissions</li>
        </ul>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
