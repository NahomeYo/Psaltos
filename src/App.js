import "./style.css";
import "./styleguide.css";
import "./cantorTab.css";
import logo from './img/logo.svg';
import search from './img/search.svg';
import jesus from './img/jesus.svg';
import Navbar from "./Navbar.js";
import Cross from "./img/icons/cross.js";
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
import SundayVespers from "./img/vespers.jpg";
import ArtistIcon from "./img/icons/artistIcon.js";
import HymnsData from "./output.json";
import ArtistData from "./artists.json";
import { useEffect, useState } from "react";

function App() {
  const [hymnData, setHymnData] = useState([]);
  const [hymn, setHymn] = useState("");
  const [artistData, setArtistData] = useState([]);
  const [filteredHymns, setFilteredHymns] = useState([]);
  const [typing, setTyping] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState();
  const [selectedArtist, setSelectedArtist] = useState();
  const [click, setClick] = useState(0);
  const [cantorContainerStyle, setCantorContainerStyle] = useState({});
  const [imgStyle, setImgStyle] = useState({});
  const [textStyle, setTextStyle] = useState({});
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const getData = async () => {
      try {
        setHymnData(HymnsData);
        setFilteredHymns(HymnsData);
        setArtistData(ArtistData);
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

  const seasons = selectedArtist
    ? [
      ...new Set(
        hymnData
          .filter(hymn => hymn.artist === selectedArtist?.artistName)
          .map(hymn => hymn.season)
      )
    ]
    : [];

  const hymns = selectedArtist && selectedSeason
    ? hymnData.filter(hymn => hymn.artist === selectedArtist?.artistName && hymn.season === selectedSeason)
    : [];

  const renderSeasons = (seasons) => {
    return (
      <div className="seasonContainer">
        {seasons.map((season, index) => (
          <div key={index} className="seasonItem" onClick={() => setSelectedSeason(season)}>
            {seasonRender(season)}
            <HeaderComponent placeholder={season} />
          </div>
        ))}
      </div>
    );
  };

  const handleArtistClick = (artist) => {
    setSelectedArtist(artist);
    setTabIndex((prevTab) => {
      return prevTab < 4 ? prevTab + 1 : 1;
    });
  };

  useEffect(() => {
    if (selectedArtist) {
      let newStyle = {
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '0px 30px 30px 0px',
        background: 'var(--primary-color)',
        borderRadius: '30px',
        marginBottom: '3vw',
      };

      let imgStyle = {};

      let textStyle = {};

      switch (tabIndex) {
        case 1:
          newStyle = {
            background: 'var(--primary-color)',
            borderRadius: '60px',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            gap: '20px',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            padding: '0',
            margin: '0',
          };

          imgStyle = {
            width: '80px',
            height: '100px',
          };

          textStyle = {
            whiteSpace: 'nowrap',
          };

          break;
        case 2:
          newStyle = {
            background: 'var(--primary-color)',
            borderRadius: '60px',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            marginBottom: '1vw',
          };
          break;
        case 3:
          newStyle = {
            background: 'var(--primary-color)',
            borderRadius: '30px 0px 0px 30px',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            padding: '0px 10px 10px 0px',
            width: 'min-content',
          };
          break;
        default:
          break;
      }
      setCantorContainerStyle(newStyle);
      setImgStyle(imgStyle);
      setTextStyle(textStyle);
    }
  }, [tabIndex, selectedArtist]);

  const nextFour = () => {
    setClick((prevClick) => Math.min(prevClick + 4, artistData.length - 4));
  };

  const prevFour = () => {
    setClick((prevClick) => Math.max(prevClick - 4, 0));
  };

  const rightArrow = () => {
    return (
      <svg
        className="rightArrow"
        onClick={nextFour}
        width="22"
        height="32"
        viewBox="0 0 22 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1.05873 17.5848C0.0187157 16.7842 0.0187151 15.2158 1.05873 14.4152L18.28 1.15824C19.5951 0.145845 21.5 1.08337 21.5 2.74305V29.2569C21.5 30.9166 19.5951 31.8542 18.28 30.8418L1.05873 17.5848Z" />
      </svg>
    );
  };

  const leftArrow = () => {
    return (
      <svg
        className="leftArrow"
        onClick={prevFour}
        width="22"
        height="32"
        viewBox="0 0 22 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1.05873 17.5848C0.0187157 16.7842 0.0187151 15.2158 1.05873 14.4152L18.28 1.15824C19.5951 0.145845 21.5 1.08337 21.5 2.74305V29.2569C21.5 30.9166 19.5951 31.8542 18.28 30.8418L1.05873 17.5848Z" />
      </svg>
    );
  };

  const renderArtist = (artist, cantorContainerStyle, handleArtistClick, imgStyle, textStyle, tabIndex) => (
    <div className="cantorTab001">
      <div className="cantorContainer" onClick={() => { handleArtistClick(artist) }} style={cantorContainerStyle}>
        <div className="topRow">
          {tabIndex === 2 && <HeaderComponent placeholder={hymn.name} />}
          {tabIndex !== 2 && <img style={imgStyle} src={artist.img} alt={`Artist ${artist.artistName}`} />}
        </div>
        <div className="artist">
          <span>
            <ArtistIcon />
            <p>CANTOR</p>
          </span>
          <b style={textStyle}>{artist.artistName}</b>
        </div>
      </div>
      <Robe />
    </div>
  );

  const renderHymns = (hymns) => {
    return (
      <div>
        {hymns.map((hymn, index) => (
          <div key={index} style={{ width: 1000 }}>
            <HeaderComponent placeholder={hymn.name} />
            <Audio />
            <br />
            <br />
          </div>
        ))}
      </div>
    );
  };

  const HeaderComponent = ({ placeholder }) => (
    <div className="headerContainer">
      <Cross />
      <h1>{placeholder}</h1>
      <Cross />
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
        return <img src={Weekday} alt="Weekday Tasbeha" />;
      case 'Sunday Vespers Praise':
        return <img src={SundayVespers} alt="Sunday Vespers" />;
      default:
        return null;
    }
  };

  const searchItem = () => (
    filteredHymns.slice(0, 10).map((hymn, index) => (
      <div key={index} className="searchItem" onClick={() => { }}>
        <div className="cantorContainer">
          <div className="topRow">
            <HeaderComponent placeholder={hymn.name} />
          </div>
          <div className="artist">
            <span>
              <ArtistIcon />
              <p>CANTOR</p>
            </span>
            <b>{hymn.artist}</b>
          </div>
        </div>
      </div>
    ))
  );

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

          <span>
            <p>The ultimate search engine to house all the hymns in the Coptic church</p>
            <img className="deaf" src={Deaf} alt="deaf" />
          </span>
        </div>
        <div className="TabList">
          <span>
            {!selectedArtist && <HeaderComponent placeholder="cantors" />}
          </span>
          <span>

            <div className="list">
              {!selectedArtist && leftArrow()}

              {!selectedArtist
                ? artistData.slice(click, click + 4).map((artist, index) => (
                  <div key={index}>
                    {renderArtist(artist, cantorContainerStyle, handleArtistClick)}
                  </div>
                ))
                : renderArtist(selectedArtist, cantorContainerStyle, handleArtistClick, imgStyle, textStyle, tabIndex)}

              {!selectedArtist && rightArrow()}
            </div>

            {selectedArtist && renderSeasons(seasons)}
          </span>
          <Cross/>
        </div>

        {selectedSeason && renderHymns(hymns)}

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