import React from 'react';
import "./style.css";
import logo from './img/logo.svg';
import search from './img/search.svg';
import jesus from './img/jesus.svg';
import Navbar from './Navbar';
import { useState, useEffect } from 'react';

function App() {
  const [hymn, setHymn] = useState({});

  useEffect(() => {
    fetch('./hymns.json')
      .then(response => response.json())
      .then(data => console.log(data));
  });

  return (
    <div>
      <Navbar />

      <div className="searchContainer">
        <img className="mainLogo" src={logo} alt="logo" />
        <h1>PSALTOS</h1>
        <div className="searchBar">
          <input type="text" placeholder="Peace be with you..." />
          <img src={search} alt="search" />
        </div>
        <p>The ultimate search engine, filtered to find all the hymns in the Coptic Church</p>
      </div>

      <img className="Jesus" src={jesus} alt="Jesus" />
      <footer></footer>
    </div>
  );
}

export default App;
