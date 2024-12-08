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
  const [objectId, setObjectId] = useState(null); // Initialize objectId
  const [currentFact, setCurrentFact] = useState(0);
  const [showBasicForm, setShowBasicForm] = useState(false);
  const [formBasicData, setFormBasicData] = useState({
    occupants: '',
    zipCode: '',
    primaryHeatingSource: '',
    energyCost: '',
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
  const [milesEntries, setMilesEntries] = useState([]); // Array to store all miles entries
  const [zipEntry, setZipEntry] = useState(null); // Array to store all miles entries
  const [costEntry, setCostEntry] = useState(null); // Array to store all miles entries


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
      energyCost: '',
    });
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

  const [lineChartData, setLineChartData] = useState({
    labels: [], // Start with an empty label array
    datasets: [
      {
        label: 'Miles Driven',
        data: [], // Start with empty data
        borderColor: '#36A2EB',
        fill: false,
      },
    ],
  });

  const handleCombinedSubmit = async (e, formType) => {
    e.preventDefault();

    const payload = { objectId }; // Include the current objectId if it exists

    if (formType === 'basicInfo') {
        payload.basicInfo = {
            habitants: formBasicData.occupants,
            zip: formBasicData.zipCode,
            heat_src: formBasicData.primaryHeatingSource,
            energy: formBasicData.energyCost,
        };

        fetchWasteEmissions(formBasicData.occupants);
    }
    if (formType === 'dailyEntry') {
      const { date, miles } = formData;
      const transportation = transportEmmissions; // Pass form values
      const homeEnergy = homeEmmissions; // Example or fetched values
      const waste = wasteEmissions; // Example or fetched values
      updatePieChart(transportation, homeEnergy, waste);

      // Ensure `miles` is a number
      const milesDriven = parseFloat(miles);
      if (isNaN(milesDriven)) {
          alert('Miles driven must be a valid number');
          return;
      }

      //Add the new miles entry to the array
      setMilesEntries((prevEntries) => [...prevEntries, {date, miles: milesDriven}]);
      setZipEntry(formBasicData.zipCode);
      setCostEntry(formBasicData.energyCost)
  
      payload.dailyEntry = { 
        date: formData.date, 
        miles: formData.miles, 
        laundry: formData.laundry, 
        dryingRack: formData.dryingRack, 
        recycled: formData.recycled, 
        thermostat: formData.thermostat, 
        heaterUsage: formData.heaterUsage };
  
      // Update line chart data
      setLineChartData((prevData) => {
          const existingLabels = [...prevData.labels];
          const existingData = [...prevData.datasets[0].data];
  
          // Check if the date already exists
          const dateIndex = existingLabels.indexOf(date);
          if (dateIndex !== -1) {
              // Update existing entry
              existingData[dateIndex] += milesDriven; // Aggregate miles if date exists
          } else {
              // Add new date and miles
              existingLabels.push(date);
              existingData.push(milesDriven);
          }
  
          return {
              ...prevData,
              labels: existingLabels,
              datasets: [
                  {
                      ...prevData.datasets[0],
                      data: existingData,
                  },
              ],
          };
      });
  }  
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/submit-data/', payload, {
            withCredentials: true,
        });

        if (response.status === 200 || response.status === 201) {
            // If the backend provides a new objectId, save it in the state
            if (!objectId && response.data.objectId) {
                setObjectId(response.data.objectId); // Save objectId for updates
                console.log("New objectId set:", response.data.objectId); // Debugging
            }

            alert('Data submitted successfully');
        } else {
            alert('Submission failed');
        }
    } catch (error) {
        alert('Error while submitting: ' + error.message);
    }
};

const [transportEmmissions, setTransportEmmissions] = useState(0)
const [homeEmmissions, setHomeEmmissions] = useState(0)

useEffect(() => {
  async function fetchTransportEmissions() {
    try {
      const milesPerWeek = milesEntries.reduce((total, entry) => total + entry.miles, 0); // Calculate weekly miles
      const avgFuelEfficiency = 21.6; // Replace with a user-provided or default value

      console.log("Sending data to backend:", { milesPerWeek, avgFuelEfficiency }); // Debugging log

      const response = await axios.post('http://127.0.0.1:5000/ghg_calculator/vehicle_emissions', {
        milesPerWeek, // Calculate weekly miles
        avgFuelEfficiency, // Default or user-provided average fuel efficiency
      });

      console.log("Response from backend:", response.data); // Debugging log
      setTransportEmmissions(response.data.emmissions);
    } catch (error) {
      console.error('Error fetching transport emissions:', error);
    }
  }

  fetchTransportEmissions();
}, [milesEntries]);

const fetchHomeEmissions = async () => {
  try {
    // Prepare the payload from form data
    const payload = {
      zip: formBasicData.zipCode,
      cost: formBasicData.energyCost,
    };

    console.log("Sending data to backend:", payload); // Debugging log

    // Make the POST request
    const response = await axios.post('http://127.0.0.1:5000/ghg_calculator/electricity_consumption', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Handle successful response
    if (response.status === 200) {
      console.log("Response from API:", response.data);
      const newHomeEmissions = response.data.emissions;

      // Update state and pie chart
      setHomeEmmissions(newHomeEmissions);
      updatePieChart(transportEmmissions, newHomeEmissions, wasteEmissions);
    } else {
      console.error("Error: Unexpected response status", response.status);
    }
  } catch (error) {
    console.error("Error while fetching home emissions:", error);
  }
};

const [wasteEmissions, setWasteEmissions] = useState(0);

const fetchWasteEmissions = async (habitants) => {
  try {
    const payload = { habitants: parseInt(habitants, 10) };
    console.log("Sending data to backend for waste emissions:", payload);

    const response = await axios.post('http://127.0.0.1:5000/ghg_calculator/waste', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      console.log("Response from backend for waste emissions:", response.data);
      const newWasteEmissions = response.data.waste;

      // Update state
      setWasteEmissions(newWasteEmissions);

      // Update the pie chart
      updatePieChart(transportEmmissions, homeEmmissions, newWasteEmissions);
    } else {
      console.error("Error: Unexpected response status", response.status);
    }
  } catch (error) {
    console.error("Error while fetching waste emissions:", error);
  }
};



useEffect(() => {
  // Recalculate emissions whenever transportEmissions changes
  handleEmissionsCalculation();
}, [transportEmmissions]);

const handleEmissionsCalculation = () => {
  const transportation = transportEmmissions; // Use updated state
  const homeEnergy = homeEmmissions // Example or fetched values
  const waste = wasteEmissions; // Example or fetched values

  console.log("Updated transportation emissions:", transportation); // Debug log
  updatePieChart(transportation, homeEnergy, waste);
};

const calculateWasteEmissions = (habitants, recycling) => {
  const averageWasteEmissions = 692; // lbs CO2/week per person
  const recyclingReduction = recycling ? -89.38 : 0; // Adjust for recycling
  return habitants * averageWasteEmissions + recyclingReduction;
};

const [pieChartData, setPieChartData] = useState({
  labels: ['Transportation', 'Home Energy', 'Waste'],
  datasets: [
    {
      data: [50, 50, 50], // Initial values
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    },
  ],
});

// Function to update pie chart data
const updatePieChart = (transportation, homeEnergy, waste) => {
  setPieChartData({
    ...pieChartData,
    datasets: [
      {
        ...pieChartData.datasets[0],
        data: [transportation, homeEnergy, waste],
      },
    ],
  });
};




  return (
  
    <div className={`dashboard-container ${theme}`}>
      <div>
      <h3>All Miles Entries:</h3>
      <ul>
        {milesEntries.map((entry, index) => (
          <li key={index}>{`Date: ${entry.date}, Miles: ${entry.miles}`}</li>
        ))}
      </ul>
      <div>
        <h3>Emmissions:</h3>
        <p>{transportEmmissions}</p>
      </div>
    </div>
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
          <Pie data={pieChartData} />
        </div>
        <div className="small-chart">
          <h3>Last Recorded Emissions</h3>
          <Line data={lineChartData} />
        </div>
      </div>
      {showBasicForm && (
        <div className="popup-overlay">
          <form className="popup-form" onSubmit={(e) => [handleCombinedSubmit(e, 'basicInfo'), handleEmissionsCalculation(), fetchHomeEmissions()]}>
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
            <label>
              <span>
                What is the cost (in USD) of using electricity per month?:
              </span>
              <input
                type="text"
                name="energyCost"
                value={formBasicData.energyCost}
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
          <form className="popup-form" onSubmit={(e) => handleCombinedSubmit(e, 'dailyEntry')}>
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
