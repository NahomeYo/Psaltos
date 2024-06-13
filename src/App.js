import React, { useState, useEffect } from 'react';
import "./style.css";
import logo from './img/logo.svg';
import search from './img/search.svg';
import jesus from './img/jesus.svg';
import Navbar from './Navbar';
import Nativity from './img/Nativity.jpg';
import Resurrection from './img/resurrection.jpg';
import Theophany from './img/theophany.jpg';
import ApostlesFast from './img/apostles.jpg';
import SundayTasbeha from './img/tasbeha.jpg';
import WeekdayTasbeha from './img/weekdayTasbeha.jpg';
import SundayVespers from './img/vespers.jpg';

const ArtistIcon = () => (
  <svg viewBox="0 0 260 260">
    <path id="Layer 1" className="s0" d="m132.3 141.1c0 0-27.8 13.5-37.1 36.5-9.2 23-8.7 47.1-8.7 47.1l-78.5-1.2c0 0-17.2-14.1-1.1-54.2 16.1-40.1 76-48 125.4-28.2zm104.8 12.9c0 0 41.2-40 13-76.5-28.2-36.5-46.9-27.6-50.1-35.3-3.3-7.7-2.6-15.9-12-15.3-9.4 0.6-9 8.4-8.8 18.8 0.3 10.4 1.1 122.5 1.1 122.5 0 0-65.3-10.5-65.4 47-0.1 57.6 82 41.4 81.8-5.8-0.2-47.3 1.1-123.7 1.1-123.7 0 0 40.7-7 41.4 22.4 0.8 29.4-10.2 45-2.1 45.9zm-148.4-146c0 0 35.7 6.3 38.2 40.1 2.5 33.8-16.6 54-40.4 54.1-23.7 0.1-41.4-14.4-42.5-48.2-1.1-33.9 26.6-46.9 44.7-46z" />
  </svg>
);

const CopticCross = () => (
  <svg viewBox="0 0 260 260">
    <path d="m130.9 6.7l17 29.8h34.1l-25.5 29.8v38.3h38.3l29.8-25.5v34.1l29.8 17-29.8 17v34.1l-29.8-25.5h-38.3v38.3l25.5 29.8h-34.1l-17 29.8-17-29.8h-34.1l25.5-29.8v-38.3h-38.3l-29.8 25.5v-34.1l-29.8-17 29.8-17v-34.1l29.8 25.5h38.3v-38.3l-25.5-29.8h34.1z" />
  </svg>
);

const TuneIcon = () => (
  <svg viewBox="0 0 260 260">
    <path d="M87.9,78.04c2.74-0.48,5.33-0.4,7.6,0.13V24.82L39.05,41.03v61.95c0.03,0.34,0.05,0.69,0.05,1.03 c0,0,0,0.01,0,0.01c0,8.34-8.75,16.62-19.55,18.49C8.76,124.37,0,119.12,0,110.77c0-8.34,8.76-16.62,19.55-18.48 c4.06-0.7,7.84-0.39,10.97,0.71l0-76.26h0.47L104.04,0v85.92c0.13,0.63,0.2,1.27,0.2,1.91c0,0,0,0,0,0.01 c0,6.97-7.32,13.89-16.33,15.44c-9.02,1.56-16.33-2.83-16.33-9.8C71.57,86.51,78.88,79.59,87.9,78.04L87.9,78.04L87.9,78.04z" />
  </svg>
);

function renderSeasonImage(season) {
  if (season === "Nativity") return <img alt="" src={Nativity} />;
  if (season === "Resurrection") return <img alt="" src={Resurrection} />;
  if (season === "Theophany") return <img alt="" src={Theophany} />;
  if (season === "Apostles Fast") return <img alt="" src={ApostlesFast} />;
  if (season === "Sunday Tasbeha (Midnight Praises)") return <img alt="" src={SundayTasbeha} />;
  if (season === "Weekday Tasbeha (Midnight Praises)") return <img alt="" src={WeekdayTasbeha} />;
  if (season === "Sunday Vespers Praise") return <img alt="" src={SundayVespers} />;

  return null;
}

const cantorImages = new Map([
  ["Cantor Gad Lewis", "https://dl.dropboxusercontent.com/scl/fi/kj29gcegzsrbpdzj8fkc7/gadLewis.jpg?rlkey=bzhn580c78qs8n7jfh2fhptqz&st=qskvbqkx&dl=0"],
  ["Cantor Ibrahim Ayad", "https://dl.dropboxusercontent.com/scl/fi/zjqlf6awx71zyzpecl7wj/IbrahimAyad.jpg?rlkey=axu12t7fjp7cgkw5aee1ubxxv&st=z3h1bwdv&dl=0"],
  ["Cantor Mikhail Girgis Elbatanony", "https://dl.dropboxusercontent.com/scl/fi/qngiwmvx8f893owurk96y/Mina.jpeg?rlkey=ogeerdpy7xxqy6my6yki390og&st=iq6mitr7&dl=0"],
]);

function renderArtistPic(artist) {
  if (artist === "Cantor Gad Lewis") return cantorImages.get("Cantor Gad Lewis");
  if (artist === "Cantor Ibrahim Ayad") return cantorImages.get("Cantor Ibrahim Ayad");
  if (artist === "Cantor Mikhail Girgis Elbatanony") return cantorImages.get("Cantor Mikhail Girgis Elbatanony");
}

function App() {
  const [input, setInput] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const [filteredHymns, setFilteredHymns] = useState([]);
  const [hymns, setHymns] = useState([]);

  useEffect(() => {
    fetch('../output.json')
      .then(response => response.json())
      .then(data => {
        const hymns = data.map(hymn => ({
          name: hymn.name,
          artist: hymn.artist,
          season: hymn.season,
          tune: hymn.tune,
          mp3: hymn.mp3
        }));
        setHymns(hymns);
      });
  }, []);

  const handleChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    setInput(inputValue);

    const filtered = hymns.filter(({ name, artist, season, tune }) => (
      name.toLowerCase().includes(inputValue) ||
      (artist && artist.toLowerCase().includes(inputValue)) ||
      (Array.isArray(season) ? season.some(seasonItem => seasonItem.toLowerCase().includes(inputValue)) : season && season.toLowerCase().includes(inputValue)) ||
      (tune && tune.toLowerCase().includes(inputValue))
    ));


    setFilteredHymns(filtered);
    setDropdown(inputValue !== '');

  };

  const uniqueSeasons = Array.from(new Set(hymns.flatMap(item => Array.isArray(item.season) ? item.season : [item.season])));
  const uniqueArtists = Array.from(new Set(hymns.flatMap(item => Array.isArray(item.artist) ? item.artist : [item.artist])));

  return (
    <>
      <Navbar />
      <img className="Jesus" src={jesus} alt="Jesus" />

      <div className="searchContainer">
        <img className="mainLogo" src={logo} alt="logo" />
        <h1>PSALTOS</h1>
        <div className="searchBarContainer">
          <div className="searchBar">
            <input
              type="text"
              onChange={handleChange}
              placeholder="Peace be with you..."
              value={input}
            />
            <img src={search} alt="search" />
          </div>

          {dropdown && filteredHymns.length > 0 && (
            <div className="dropdown">
              {filteredHymns.slice(0,10).map((hymn, index) => (
                <div className="bar" key={index}>
                  <li>
                    <ul>
                      <CopticCross />
                      <h2>{hymn.name.toUpperCase()}</h2>
                    </ul>
                  </li>
                  <li>
                    <img src={renderArtistPic(hymn.artist)} alt="" />
                    <ul>
                      <ArtistIcon />
                      <h3>{hymn.artist}</h3>
                    </ul>
                  </li>
                  <li>
                    <ul>
                      <TuneIcon />
                      <h3>{hymn.tune}</h3>
                    </ul>
                  </li>
                </div>
              ))}
            </div>
          )}
        </div>
        <p>The ultimate search engine, filtered to find all the hymns in the Coptic Church</p>
      </div>

      <div className="selectionContainer">
        <select>
          <option value="someOption">Seasons</option>
          <option value="otherOption">Artists</option>
        </select>
        <div className="selectionBoxes">
          <ul>
            {uniqueSeasons.map((season, index) => (
              <li key={index}>
                {renderSeasonImage(season)}
                <div class="seasonTitle">
                  <CopticCross />
                  <div className="overlay">
                    {season}
                  </div>
                  <CopticCross />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="selectionBoxesArtist">
          <ul>
            {uniqueArtists.map((artist, index) => (
              <li key={index}>
                <img src={renderArtistPic(artist)} alt="" />
                {artist}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <footer></footer>
    </>
  );
}

export default App;