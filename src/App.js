import "./style.css";
import "./styleguide.css";
import "./cantorTab.css";
import logo from './img/logo.svg';
import search from './img/search.svg';
import jesus from './img/jesus.svg';
import Navbar from "./Navbar.js";
import Cross from "./img/icons/cross.js";
import mikhailGirgis from "./img/profiles/MikhailGirgis.jpeg";
import Church from "./img/church.svg";
import Deaf from "./img/cymbals.svg";
import CrossIcon from "./img/icons/crossButton.js";
import Robe from "./img/icons/robe.js";
import Nativity from "./img/Nativity.jpg";
import Audio from "./Audio.js";
import Resurrection from "./img/resurrection.jpg";
import Theophany from "./img/tasbeha.jpg";
import Apostles from "./img/apostles.jpg";
import SundayTesbaha from "./img/tasbeha.jpg";
import Weekday from "./img/weekdayTasbeha.jpg";
import SundayVespers from "./img/vespers.jpg"
import ArtistIcon from "./img/icons/artistIcon.js";
import { useEffect, useState } from "react";

function App() {
  const [hymnData, setHymnData] = useState([]);
  const [hymn, setHymn] = useState("");
  const [artists, setArtists] = useState([]);
  const [filteredHymns, setFilteredHymns] = useState([]);
  const [typing, setTyping] = useState(false);
  const [seasons, setSeasons] = useState([]);
  const [tabStage, setTabStage] = useState(0);
  const [selectedHymn, setSelectedHymn] = useState([]);
  const [filteredHymnsByArtist, setFilteredHymnsByArtist] = useState([]);
  const [render, setRender] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch("http://localhost:3000/output.json");
        const jsonData = await response.json();
        const hymns = jsonData.map((hymn) => ({
          name: hymn.name,
          artist: hymn.artist,
          season: hymn.season,
          tune: hymn.tune,
          audio: hymn.mp3,
        }));
        setHymnData(hymns);
        setFilteredHymns(hymns);

        setSeasons([...new Set(hymns.map((hymn) => hymn.season))]);
        setArtists([...new Set(hymns.map((hymn) => hymn.artist))]);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);

  const hymnSearch = (event) => {
    const input = event.target.value.toLowerCase();
    setHymn(input);
    setTyping(Boolean(input));

    const searchMatch = hymnData.filter((hymn) =>
      hymn.name.toLowerCase().includes(input) ||
      hymn.artist.toLowerCase().includes(input) ||
      hymn.season.toLowerCase().includes(input)
    );

    setFilteredHymns(searchMatch);
  };

  const artistEdit = (hymn) => hymn?.artist?.substring(7) || hymn?.artist || "";

  const TabList = () => {
    const [click, setClick] = useState(0);

    const nextFour = () => {
      setClick(prevClick => Math.min(prevClick + 4, artists.length - 4));
    }

    const prevFour = () => {
      setClick(prevClick => Math.max(prevClick - 4, 0));
    }

    return (
      <div className="TabList">
        <span>
          <HeaderComponent placeHolder="cantors" />
          <p>Choose a Coptic deacon to enrich your spiritual journey with traditional hymns</p>
        </span>
        <span>
          <svg className="leftArrow" onClick={prevFour} width="22" height="32" viewBox="0 0 22 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.05873 17.5848C0.0187157 16.7842 0.0187151 15.2158 1.05873 14.4152L18.28 1.15824C19.5951 0.145845 21.5 1.08337 21.5 2.74305V29.2569C21.5 30.9166 19.5951 31.8542 18.28 30.8418L1.05873 17.5848Z" />
          </svg>
          <div className="list">
            {artists.slice(click, click + 4).map((artist, index) => (
              <div key={index} onClick={() => {
                setSelectedHymn(artist);
                setTabStage((prevStage) => (prevStage + 1) % 4);

                const artistHymns = hymnData.filter(hymn => hymn.artist === artist);
                setFilteredHymnsByArtist(artistHymns);
              }}>
                {renderTab(artist)}
              </div>
            ))}
          </div>
          <svg className="rightArrow" onClick={nextFour} width="22" height="32" viewBox="0 0 22 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.05873 17.5848C0.0187157 16.7842 0.0187151 15.2158 1.05873 14.4152L18.28 1.15824C19.5951 0.145845 21.5 1.08337 21.5 2.74305V29.2569C21.5 30.9166 19.5951 31.8542 18.28 30.8418L1.05873 17.5848Z" />
          </svg>
          {render && renderHymnsBySeason()}
        </span>
      </div>
    );
  }

  const renderTab = (artist) => {
    switch (tabStage) {
      case 0:
        return cantorTab001(artist);
      case 1:
        return cantorTab002();
      case 2:
        return cantorTab003();
      case 3:
        return cantorTab004();
      default:
        return cantorTab001(artist);
    }
  }

  const renderHymnsBySeason = () => {
    const seasons = [...new Set(filteredHymnsByArtist.map(hymn => hymn.season))];

    return (
      <div className="seasonContainer">
        {seasons.map((season, index) => (
          <div key={index} className="seasonItem">
            {seasonRender(season)}
            <HeaderComponent placeHolder={season} />
          </div>
        ))}
      </div>
    );
  };

  const HeaderComponent = ({ placeHolder }) => (
    <div className="headerContainer">
      <Cross />
      <h1>{placeHolder}</h1>
      <Cross />
    </div>
  );

  const cantorTab001 = (artist) => (
    <div className="cantorTab001" onClick={() => setTabStage(1)}>
      <div className="cantorContainer">
        <div className="topRow">{profilePic()}</div>
        <div className="artist">
          <span>
            <ArtistIcon />
            <p>CANTOR</p>
          </span>
          <b>{artist}</b>
        </div>
      </div>
      <Robe />
    </div>
  );

  const cantorTab002 = () => (
    <div className="cantorTab002" onClick={() => {
      setTabStage(2);
      setRender(true);
    }}
    >
      <div className="cantorContainer">
        <div className="topRow">{profilePic()}</div>
        <div className="artist">
          <span>
            <ArtistIcon />
            <p>CANTOR</p>
          </span>
          <b>{artistEdit(selectedHymn)}</b>
        </div>
      </div>
      <Robe />
    </div>
  );

  const cantorTab003 = () => (
    <div className="cantorTab003" onClick={() => setTabStage(3)}>
      <div className="cantorContainer">
        <div className="topRow">
          <HeaderComponent placeHolder={selectedHymn.name} />
        </div>
        <div className="artist">
          <span>
            <ArtistIcon />
            <p>CANTOR</p>
          </span>
          <b>{artistEdit(selectedHymn)}</b>
        </div>
      </div>
    </div>
  );

  const cantorTab004 = () => (
    <div className="cantorTab004">
      <div className="cantorContainer">
        <div className="topRow">
          {profilePic()}
          <HeaderComponent placeHolder={selectedHymn.name} />
        </div>
        <div className="artist">
          <span>
            <ArtistIcon />
            <p>CANTOR</p>
          </span>
          <b>{artistEdit(selectedHymn)}</b>
        </div>
        <Audio />
      </div>
    </div>
  );

  const seasonRender = (season) => {
    switch (season) {
      case 'Nativity':
        return <img src={Nativity} alt="Nativity Season" />;
      case 'Resurrection':
        return <img src={Resurrection} alt="Resurrection Season" />;
      case 'Theophany':
        return <img src={Theophany} alt="Theophany Season" />;
      case 'Apostles Fast':
        return <img src={Apostles} alt="Apostles Fast Season" />;
      case 'Sunday Tasbeha (Midnight Praises)':
        return <img src={SundayTesbaha} alt="Sunday Tasbeha" />;
      case 'Weekday Tasbeha (Midnight Praises)':
        return <img src={Weekday} alt="Sunday Tasbeha" />;
      case 'Sunday Vespers Praise':
        return <img src={SundayVespers} alt="Sunday Tasbeha" />;
      default:
        return null;
    }
  };

  const searchItem = () => (
    filteredHymns.slice(0, 10).map((hymn, index) => (
      <div key={index} className="searchItem" onClick={() => { }}>
        <div className="cantorContainer">
          <div className="topRow">
            <HeaderComponent placeHolder={hymn.name} />
          </div>
          <div className="artist">
            <span>
              <ArtistIcon />
              <p>CANTOR</p>
            </span>
            <b>{artistEdit(hymn)}</b>
          </div>
        </div>
      </div>
    ))
  );

  const profilePic = () => {
    switch (selectedHymn) {
      case "Cantor Mikhail Girgis Elbatanony":
        return <img src={mikhailGirgis} alt="Cantor Mikhail" />;
      case "Cantor Ibrahim Ayad":
        return <img src={Nativity} alt="Cantor Ibrahim" />;
      default:
        return <img src={mikhailGirgis} alt="Cantor Default" />;
    }
  };

  return (
    <div className="mainContainer">
      <div className="contents">
        <Navbar />
        <img className="Jesus" src={jesus} alt="Jesus" />
        <div className="titleContainer">
          <img className="mainLogo" src={logo} alt="logo" />
          <span>Psaltos</span>
        </div>
        <div className="searchBarContainer">
          <div className="searchBar">
            <input
              type="text"
              value={hymn}
              placeholder="Peace be with you..."
              onChange={hymnSearch}
            />
            <img src={search} alt="search" />
          </div>
          {typing && searchItem()}
        </div>
        <p>The ultimate search engine to house all the hymns in the Coptic church</p>
        <img className="deaf" src={Deaf} alt="deaf" />
        {TabList()}
        {filteredHymnsByArtist.length > 0 && renderHymnsBySeason()}
        <div className="footer">
          <nav>
            <li><img src={logo} alt="logo" /></li>
            <CrossIcon />
            <li><a href="about.html"><h2>About</h2></a></li>
            <CrossIcon />
            <li><a href="contact.html"><h2>Contact</h2></a></li>
          </nav>
          <p>Copyright @ 2024 Psaltos | All rights reserved</p>
        </div>
      </div>
      <img className="churchImg" src={Church} alt="church" />
    </div>
  );
}

export default App;