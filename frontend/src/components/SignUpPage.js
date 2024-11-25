// src/components/SignUpPage.js

import React, { useState } from 'react';
import './SignUpPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here (backend)
    axios.post('http://127.0.0.1:8000/register/', {
      name: formData.name,
      email: formData.email,
      password : formData.password,
    })
    .then((response) => {
      console.log(response);
      navigate('/login');
    })
    .catch(error => {
      console.log(error)
    });
    console.log('Form submitted:', formData);
  };

  return (
    <div className="sign-up-page">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpPage;
