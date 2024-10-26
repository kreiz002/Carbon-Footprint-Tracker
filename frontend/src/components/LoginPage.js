// src/components/LoginPage.js

import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for when user hits log in (backend)
    console.log('Form submitted:', formData);
  };

  return (
    <div className="login-page">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
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

        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginPage;
