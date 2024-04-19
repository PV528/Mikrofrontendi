import React from 'react';
import './navigation.css';

export default function Navigation() {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item"><a href="http://localhost:3999">Domov</a></li>
        <li className="nav-item"><a href="http://localhost:4000">Avtomobili microfrontend</a></li>
        <li className="nav-item"><a href="http://localhost:4001">Najemi microfrontend</a></li>
        <li className="nav-item"><a href="http://localhost:4002">Uporabniki microfrontend</a></li>
        {/* Add more navigation links as needed */}
      </ul>
    </nav>
  );
}
