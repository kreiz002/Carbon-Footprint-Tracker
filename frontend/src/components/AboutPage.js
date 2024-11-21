// src/components/AboutPage.js

import React from 'react';
import Footer from './Footer'; 
import './AboutPage.css'; 
import CarbonFootprintImage from '../assets/carbon-footprint.png';


function AboutPage() {
  return (
    <div className="about-page">
      <header className="about-header">
        <h1>About Carbon Footprint Tracker</h1>
      </header>
      
      <section className="about-content">
        <h2>Our Mission</h2>
        <p>
          Carbon Footprint Tracker aims to help individuals and organizations track, monitor, 
          and reduce their carbon footprint by providing actionable insights and personalized recommendations.
        </p>

        <h2>Features</h2>
        <ul>
          <li>Track your daily carbon emissions based on activities</li>
          <li>Monitor progress over time with detailed graphs</li>
          <li>Receive personalized recommendations to reduce emissions</li>
        </ul>

        <h2>Join Us in Making a Difference</h2>
        <p>Ready to track and reduce your carbon footprint? Sign up now by clicking the link below.</p>
        <a href="/signup" className="cta-button">Get Started</a>
        
        <img src={CarbonFootprintImage} alt="Carbon Footprint" className="carbon-footprint-image" />
      </section>

      <Footer />
    </div>
  );
}

export default AboutPage;
