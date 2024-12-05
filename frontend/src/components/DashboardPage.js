import React, { useState, useEffect } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import './DashboardPage.css';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

// Register necessary Chart.js elements and scales
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

function DashboardPage({handleLogout}) {
  const facts = [
    "Reduce, reuse, and recycle to cut down on waste.",
    "Use public transportation, bike, or walk instead of driving.",
    "Switch to renewable energy sources like solar or wind.",
    "Conserve energy by turning off lights when not in use.",
  ];

  const [currentFact, setCurrentFact] = useState(0);
  const [showBasicForm, setShowBasicForm] = useState(false);
  const [formBasicData, setFormBasicData] = useState({
    occupants: '',
    zipCode: '',
    primaryHeatingSource: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    miles: '',
    laundry: '',
    dryingRack: '',
    recycled: '',
    thermostat: '', // New field
    heaterUsage: '', // New field
  });
  const [theme, setTheme] = useState('light'); // Light theme by default

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const nextFact = () => setCurrentFact((prev) => (prev + 1) % facts.length);
  const prevFact = () => setCurrentFact((prev) => (prev - 1 + facts.length) % facts.length);
  
  const openBasicForm = () => setShowBasicForm(true);
  const closeBasicForm = () => {
    setShowBasicForm(false);
    resetBasicForm();
  };

  const handleBasicInputChange = (e) => {
    const { name, value } = e.target;
    setFormBasicData({
      ...formBasicData,
      [name]: value,
    });
  };

  const resetBasicForm = () => {
    setFormBasicData({
      occupants: '',
      zipCode: '',
      primaryHeatingSource: '',
    });
  };

  const handleBasicSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/submit-data/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formBasicData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Data submitted successfully:', responseData);
        alert('Form submitted successfully!');
      } else {
        console.error('Failed to submit data:', response.status, response.statusText);
        alert('Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Error while submitting form:', error);
      alert('An error occurred while submitting the form. Please try again later.');
    }
  };

  const openForm = () => setShowForm(true);
  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetForm = () => {
    setFormData({
      date: '',
      miles: '',
      laundry: '',
      dryingRack: '',
      recycled: '',
      thermostat: '', // Reset thermostat
      heaterUsage: '', // Reset heater usage
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/submit-data/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Data submitted successfully:', responseData);
        alert('Form submitted successfully!');
      } else {
        console.error('Failed to submit data:', response.status, response.statusText);
        alert('Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Error while submitting form:', error);
      alert('An error occurred while submitting the form. Please try again later.');
    }
  };

  const pieData = {
    labels: ['Transportation', 'Home Energy', 'Waste'],
    datasets: [
      {
        data: [30, 50, 20],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Emissions',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: '#36A2EB',
        fill: false,
      },
    ],
  };

  return (
    <div className={`dashboard-container ${theme}`}>
      <div className="header">
        <span>Carbon Footprint Tracker</span>
        <label className="theme-toggle">
          <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
          <span className="slider"></span>
        </label>
      </div>
      <div className="content-container">
        <div className="sidebar">
          <h2>Hello, John Doe</h2>
        </div>
        <div className="carousel-container">
          <button className="carousel-button left" onClick={prevFact}>
            &#9664;
          </button>
          <div className="carousel-content" key={currentFact}>
            <p>{facts[currentFact]}</p>
          </div>
          <button className="carousel-button right" onClick={nextFact}>
            &#9654;
          </button>
        </div>
      </div>
      <div className="button-container">
        <button className="action-button" onClick={openBasicForm}>
          Basic Information
        </button>
        <button className="action-button">Show Recommendations</button>
        <button className="action-button" onClick={openForm}>
          Make Daily Entry
        </button>
        <button onClick={handleLogout} className="action-button">Sign Out</button>
      </div>
      <div className="chart-container">
        <div className="small-chart">
          <h3>Weekly Carbon Emissions</h3>
          <Pie data={pieData} />
        </div>
        <div className="small-chart">
          <h3>Last Recorded Emissions</h3>
          <Line data={lineData} />
        </div>
      </div>
      {showBasicForm && (
        <div className="popup-overlay">
          <form className="popup-form" onSubmit={handleBasicSubmit}>
            <button type="button" className="close-button" onClick={closeBasicForm}>
              X
            </button>
            <h2>Basic Information Form</h2>
            <label>
              <span>How many people live in your home?:</span>
              <input
                type="text"
                name="occupants"
                value={formBasicData.occupants}
                onChange={handleBasicInputChange}
                required
              />
            </label>
            <label>
              <span>What is your zip code?:</span>
              <input
                type="text"
                name="zipCode"
                value={formBasicData.zipCode}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) {
                    handleBasicInputChange(e);
                  }
                }}
                required
              />
            </label>
            <label>
              <span>
                What is your household's primary heating source?:
                <p><small>Enter <b>1</b> for natural gas, <b>2</b> for electric heat, <b>3</b> for oil, 
                <b>4</b> for propane, <b>5</b> for wood, or <b>6</b> if you do not heat your house</small></p>
              </span>
              <input
                type="text"
                name="primaryHeatingSource"
                value={formBasicData.primaryHeatingSource}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) {
                    handleBasicInputChange(e);
                  }
                }}
                required
              />
            </label>
            <div className="form-buttons">
              <button type="submit" className="submit-button">
                Submit
              </button>
              <button type="button" className="reset-button" onClick={resetBasicForm}>
                Reset
              </button>
            </div>
          </form>
        </div>
      )}
      {showForm && (
        <div className="popup-overlay">
          <form className="popup-form" onSubmit={handleSubmit}>
            <button type="button" className="close-button" onClick={closeForm}>
              X
            </button>
            <h2>Daily Entry Form</h2>
            <label>
              <span>Date:</span>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              <span>Total Miles Driven:</span>
              <input
                type="text"
                name="miles"
                value={formData.miles}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) {
                    handleInputChange(e);
                  }
                }}
                required
              />
            </label>
            <label>
              <span>Laundry Loaded with cold water:</span>
              <select name="laundry" value={formData.laundry} onChange={handleInputChange}>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            <label>
              <span>Drying Rack Used Today:</span>
              <select name="dryingRack" value={formData.dryingRack} onChange={handleInputChange}>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            <label>
              <span>Recycled Any Trash:</span>
              <select name="recycled" value={formData.recycled} onChange={handleInputChange}>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            <label>
              <span>Thermostat (in °F):</span>
              <input
                type="text"
                name="thermostat"
                value={formData.thermostat}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) {
                    handleInputChange(e);
                  }
                }}
                required
              />
            </label>
            <label>
              <span>Heater Usage:</span>
              <select name="heaterUsage" value={formData.heaterUsage} onChange={handleInputChange}>
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            <div className="form-buttons">
              <button type="submit" className="submit-button">
                Submit
              </button>
              <button type="button" className="reset-button" onClick={resetForm}>
                Reset
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
