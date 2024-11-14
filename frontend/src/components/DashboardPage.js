import React, { useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import './DashboardPage.css';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
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

function DashboardPage() {
  const facts = [
    "Reduce, reuse, and recycle to cut down on waste.",
    "Use public transportation, bike, or walk instead of driving.",
    "Switch to renewable energy sources like solar or wind.",
    "Conserve energy by turning off lights when not in use."
  ];

  const [currentFact, setCurrentFact] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    task: 'transportation',
    timeRequired: '',
  });

  const nextFact = () => {
    setCurrentFact((prev) => (prev + 1) % (facts.length + 1));
  };

  const prevFact = () => {
    setCurrentFact((prev) => (prev - 1 + (facts.length + 1)) % (facts.length + 1));
  };

  const openForm = () => {
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm(); // Reset form when closed
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "timeRequired" && !/^\d*\.?\d*$/.test(value)) {
      return; // Only allow numbers and decimals in "Time Required"
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetForm = () => {
    setFormData({
      date: '',
      task: 'transportation',
      timeRequired: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
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
    <div className="dashboard-container">
      <div className="header">
        Carbon Footprint Tracker
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
            {currentFact === 0 ? (
              <h2>Tip to Reduce Carbon Footprint</h2>
            ) : (
              <p>{facts[currentFact - 1]}</p>
            )}
          </div>
          <button className="carousel-button right" onClick={nextFact}>
            &#9654;
          </button>
        </div>
      </div>
      <div className="button-container">
        <button className="action-button">Show Recommendations</button>
        <button className="action-button" onClick={openForm}>Make Daily Entry</button>
        <button className="action-button">Sign Out</button>
      </div>
      <div className="chart-container">
        <div className="small-chart">
          <h3>Weekly Carbon Emissions</h3>
          <Pie data={pieData} />
        </div>
        <div className="small-chart">
          <h3>Daily Emissions</h3>
          <Line data={lineData} />
        </div>
      </div>

      {showForm && (
        <div className="popup-overlay">
          <form className="popup-form" onSubmit={handleSubmit}>
            <button type="button" className="close-button" onClick={closeForm}>X</button>
            <h2>Daily Entry Form</h2>
            <label>
              Date:
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Daily Task:
              <select
                name="task"
                value={formData.task}
                onChange={handleInputChange}
              >
                <option value="transportation">Transportation</option>
                <option value="homeEnergy">Home Energy</option>
                <option value="waste">Waste</option>
              </select>
            </label>
            <label>
              Time Required (hours):
              <input
                type="text"
                name="timeRequired"
                value={formData.timeRequired}
                onChange={handleInputChange}
                required
              />
            </label>
            <div className="form-buttons">
              <button type="submit" className="submit-button">Submit</button>
              <button type="button" className="reset-button" onClick={resetForm}>Reset</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
