// src/components/Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

function Navbar({handleLogout}) {
  console.log("In navbar: ");
  console.log(JSON.parse(localStorage.getItem("userLogged")));
  return (
    <header className="navbar">
      <h1>Carbon Footprint Tracker</h1>
      <nav>
        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/signup">Sign Up</Link></li>
          <li><Link to="/login">Log In</Link></li>
          <li><Link to="/Dashboard">Dashboard</Link></li>
          <li>{JSON.parse(localStorage.getItem("userLogged"))!==null ? (
            console.log("user not null"),
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
