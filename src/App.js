import React, { useState } from 'react';
import "./style.css";
import logo from './img/logo.svg';
import search from './img/search.svg';
import jesus from './img/jesus.svg';
import Navbar from './Navbar';

const hymns = [
  {
    "name": "Agios",
    "artist": "Gad Lewis",
    "season": "Nativity",
    "tune": "Joyful",
    "mp3": "https://media.tasbeha.org/mp3/Hymns/Annual/Congregation_Responses/Cantor_Gad_Lewis/17_The_Trisagion.mp3",
    "pic": "https://www.facebook.com/photo/?fbid=569085788352005&set=a.569085765018674"
  },
  {
    "name": "The seven tunes",
    "artist": "Ibrahim Ayad",
    "season": [
      "Nativity",
      "Resurrection"
    ],
    "tune": "Joyful",
    "mp3": "https://media.tasbeha.org/mp3/Hymns/Major_Feasts_of_the_Lord/Nativity/Ibrahim_Ayad/04_The_Seven_Ways-Tunes.1530.mp3",
    "pic": "https://www.facebook.com/photo/?fbid=406495378181282&set=pb.100064624696431.-2207520000&locale=sk_SK"
  },
  {
    "name": "Psalm 150",
    "artist": "Ibrahim Ayad",
    "season": "Annual",
    "tune": "Annual",
    "mp3": null,
    "pic": "https://www.facebook.com/photo/?fbid=406495378181282&set=pb.100064624696431.-2207520000&locale=sk_SK"
  },
  {
    "name": "Psalm 150 for distribution",
    "artist": "Ibrahim Ayad",
    "season": "Nativity",
    "tune": "Kiahk",
    "mp3": null,
    "pic": null
  },
  {
    "name": "Verses of Cymbals",
    "artist": "Ibrahim Ayad",
    "season": "Annual",
    "tune": null,
    "mp3": null,
    "pic": null
  }
];

function App() {
  const [input, setInput] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const [filteredHymns, setFilteredHymns] = useState([]);

  function handleChange(e) {
    const inputValue = e.target.value.toLowerCase();
    setInput(inputValue);
    const filter = hymns.filter(({ name, artist, season, tune }) => (
      name.toLowerCase().includes(inputValue) ||
      artist.toLowerCase().includes(inputValue) ||
      (Array.isArray(season) && season.some(seasonItem => seasonItem.toLowerCase().includes(inputValue))) ||
      (!Array.isArray(season) && season.toLowerCase().includes(inputValue)) ||
      (tune && tune.toLowerCase().includes(inputValue))
    ));

    setFilteredHymns(filter);
    if (inputValue !== '') {
      setDropdown(true);
    } else {
      setDropdown(false);
    }
  }

  return (
    <>
      <Navbar />

      <div className="searchContainer">
        <img className="mainLogo" src={logo} alt="logo" />
        <h1>PSALTOS</h1>
        <div className="searchBar">
          <input type="text"
            onChange={handleChange}
            placeholder="Peace be with you..."
            value={input} />
          <img src={search} alt="search" />
        </div>

        {dropdown && filteredHymns.length > 0 ?
          <div className="dropdown">
            {filteredHymns.map((hymn, index) => (
              <div key={index}>
                <h2>{hymn.name}</h2>
                <p><img alt="" src="./img/copticCross.svg" />Artist: {hymn.artist}</p>
                <p>Season: {Array.isArray(hymn.season) ? hymn.season.join(", ") : hymn.season}</p>
                <p>Tune: {hymn.tune}</p>
                <img src={hymn.pic} alt={hymn.name} />
              </div>
            ))}
          </div> : null}

        <p>The ultimate search engine, filtered to find all the hymns in the Coptic Church</p>
      </div>

      <img className="Jesus" src={jesus} alt="Jesus" />
      <footer></footer>
    </>
  );
}

export default App;