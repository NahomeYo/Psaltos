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
import Audio from "./Audio.js";
import Nativity from "./img/copticIcons/Nativity.jpg";
import Resurrection from "./img/copticIcons/Ressurection.jpeg"
import Theophany from "./img/copticIcons/Theophany.jpg";
import Apostles from "./img/copticIcons/Apostles.jpg";
import SundayTesbaha from "./img/copticIcons/SundayTesbaha.jpg";
import Weekday from "./img/copticIcons/WeekdayTesbaha.jpg";
import SundayVespers from "./img/copticIcons/SundayVespers.jpg";
import ArtistIcon from "./img/icons/artistIcon.js";
import HymnsData from "./output.json";
import ArtistData from "./artists.json";
import { useEffect, useState } from "react";
import crossIcon from "./img/icons/crossButton.svg"

function App() {
  const [hymnData, setHymnData] = useState([]);
  const [hymn, setHymn] = useState("");
  const [artistData, setArtistData] = useState([]);
  const [filteredHymns, setFilteredHymns] = useState([]);
  const [typing, setTyping] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState();
  const [selectedArtist, setSelectedArtist] = useState();
  const [click, setClick] = useState(false);
  const [cantorContainerStyle, setCantorContainerStyle] = useState({});
  const [imgStyle, setImgStyle] = useState({});
  const [textStyle, setTextStyle] = useState({});
  const [tabIndex, setTabIndex] = useState(0);
  const [expandedHymns, setExpandedHymns] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [seasonChoice, setSeasonChoice] = useState(1);

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

    setSelectedIndex()
  }, [click]);

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

  const feasts = (seasons) => {
    return seasons.filter((season) =>
      ["Nativity", "Resurrection", "Theophany", "Apostles Fast"].includes(season)
    );
  };

  const psalmody = (seasons) => {
    return seasons.filter(
      (season) =>
        ["Sunday Vespers Praise", "Sunday Tasbeha (Midnight Praises)", "Weekday Tasbeha (Midnight Praises)"].includes(season)
    );
  };

  const feastSeasons = feasts(seasons);
  const psalmodySeasons = psalmody(seasons);

  const hymns = selectedArtist && selectedSeason
    ? hymnData.filter(hymn => hymn.artist === selectedArtist?.artistName && hymn.season === selectedSeason)
    : [];

  const handleArtistClick = (artist) => {
    if (tabIndex === 0) {
      setTabIndex(1);
    }
    setSelectedArtist(artist);
  };


  const nextFour = () => {
    setClick(!click);
  }

  const renderHymnBox = {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--primary-color)',
    borderRadius: '30px',
    height: 'min-content',
    width: '100%',
  };

  useEffect(() => {
    if (selectedArtist) {
      let cantorTabNewStyle = {
      };

      let imgStyle = {};

      let textStyle = {};

      switch (tabIndex) {
        case 1:
          cantorTabNewStyle = {
            background: 'var(--primary-color)',
            overflow: 'hidden',
            flexDirection: 'row',
            alignItems: 'start',
            justifyContent: 'start',
            whiteSpace: 'nowrap',
            margin: '0',
            height: 'min-content',
            width: '100%',
            borderRadius: '60px 0px 0px 60px',
            paddingBottom: '0px',
          };

          imgStyle = {
            width: '100px',
            height: '100px',
          };

          textStyle = {
            whiteSpace: 'nowrap',
            padding: '0px 30px 30px 0px',
          };

          break
        default:
          break;
      }
      setImgStyle(imgStyle);
      setTextStyle(textStyle);
      setCantorContainerStyle(cantorTabNewStyle);
    }
  }, [tabIndex, selectedArtist, selectedSeason]);

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
      <div
        className="cantorContainer"
        onClick={() => { handleArtistClick(artist) }}
        style={cantorContainerStyle}
      >
        <div className="topRow">
          {tabIndex === 2 && <HeaderComponent placeholder={hymn.name} />}
          {tabIndex !== 2 && <img style={imgStyle} src={artist.img} alt={`Artist ${artist.artistName}`} />}
        </div>
        <div className="artist">
          <span>
            <ArtistIcon />
            <p>CANTOR</p>
          </span>
          <h3 style={textStyle}>{artist.artistName}</h3>
        </div>
      </div>
      <Robe />
    </div>
  );

  const tab = document.querySelector('.TabList span:first-child .cantorContainer ');
  const tabStyle = getComputedStyle(tab);
  const tabHeight = tabStyle.height;

  const renderHymn = (hymns, artistData) => {
    return (
      <div className="hymnContainer">
        {(
          <div className="header">
            <HeaderComponent placeholder={selectedSeason} />
          </div>
        )}

        {hymns.map((hymn, index) => (
          <div
            className="cantorTab001"
            style={textStyle}
            key={index}
            onClick={() => {
              if (expandedHymns === index) {
                setExpandedHymns(-1);
              } else {
                setExpandedHymns(index);
              }
            }}
          >
            <div className="cantorContainer" style={renderHymnBox}>
              <div className="topRow">
                {expandedHymns === index && (
                  <img style={imgStyle} src={artistData.img} alt={`Artist`} />
                )}
                <HeaderComponent placeholder={hymn.name} />
              </div>

              {expandedHymns === index && <div className="artist">
                <span>
                  <ArtistIcon />
                  <p>CANTOR</p>
                </span>
                <h3 style={textStyle}>{selectedArtist?.artistName}</h3>
              </div>}

              {expandedHymns === index && <Audio />}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const feastOptions = (feastSeasons) => {
    return (
      <div className="feastContainer">
        {feastSeasons.map((feast, index) => {
          const isActive = index === selectedIndex;
          return (
            <div
              key={index}
              className="seasonItem"
              style={{
                background: isActive ? 'none' : 'none',
                padding: isActive ? '0vw' : '0vw',
                borderBottom: isActive ? 'none' : 'none',
                transition: 'background 0.3s, padding 0.3s, borderBottom 0.3s',
              }}
              onMouseEnter={() => setSelectedIndex(index)}
              onMouseLeave={() => setSelectedIndex(-1)}
              onClick={() => setSelectedSeason(feast)}
            >
              {seasonRender(feast)}
              <HeaderComponent placeholder={feast} />
              <p>Feast</p>
            </div>
          );
        })}
      </div>
    )
  }

  const psalmodyOptions = (psalmodySeasons) => {
    return (
      <div className="psalmodyContainer">
        {psalmodySeasons.map((psalm, index) => {
          const isActive = index === selectedIndex;
          return (
            <div
              key={index}
              className="seasonItem"
              style={{
                background: isActive ? 'none' : 'none',
                padding: isActive ? '0vw' : '0vw',
                borderBottom: isActive ? 'none' : 'none',
                transition: 'background 0.3s, padding 0.3s, borderBottom 0.3s',
              }}
              onMouseEnter={() => setSelectedIndex(index)}
              onMouseLeave={() => setSelectedIndex(-1)}
              onClick={() => setSelectedSeason(psalm)}
            >
              {seasonRender(psalm)}
              <HeaderComponent placeholder={psalm} />
              <p>Psalmody</p>
            </div>
          );
        })}
      </div>
    )
  }

  const renderSeasons = () => {
    return (
      <div style={{ marginTop: tabHeight, }} className="seasonsContainer">
        <row>
          <column>
            <row>
              <t>Find the Hymn Season</t>
            </row>
            <row>
              <b style={{
                background: seasonChoice === 1 ? 'var(--primary-color)' : 'var(--secondary-color)',
                transition: "1s ease"
              }}
                onClick={() => {
                  setSeasonChoice(1);
                }}>
                Feast</b>

              <b style={{
                background: seasonChoice === 2 ? 'var(--primary-color)' : 'var(--secondary-color)',
              }}
                onClick={() => {
                  setSeasonChoice(2);
                }}>Psalmody</b>
            </row>
          </column>

          <column>
            <p>Select a Coptic season you're interested in and see Cantor</p>
            <h3>{selectedArtist?.artistName}'s</h3>
            <p>hymns</p>
          </column>
        </row>

        <row>
          {seasonChoice === 1 && feastOptions(feastSeasons)}
          {seasonChoice === 2 && psalmodyOptions(psalmodySeasons)}
        </row>
      </div>
    );
  };

  const HeaderComponent = ({ placeholder }) => (
    <div className="headerContainer">
      <Cross />
      {searchItem ? <h2>{placeholder}</h2> : <h>{placeholder}</h>}
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
        <div className="topRow">
          <HeaderComponent placeholder={hymn.name} />
        </div>
        <div className="artist">
          <span>
            <ArtistIcon />
            <p>CANTOR</p>
          </span>
          <h3>{hymn.artist}</h3>
        </div>
      </div>
    ))
  );

  const ProgressBar = ({ artistData }) => {
    const progressBars = [];

    for (let i = 0; i < artistData.length; i += 4) {
      progressBars.push(
        <div key={i} className="progress">
        </div>
      );
    }
    return <>{progressBars}</>;
  };

  return (
    <div className="mainContainer">
      <div className="contents">
        <Navbar />
        <img className="Jesus" src={jesus} alt="Jesus" />
        <div className="titleContainer">
          <img className="mainLogo" src={logo} alt="logo" />
          <t>Psaltos</t>
        </div>

        <div className="searchBarContainer">

          <div className="background">
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

          <div className="caption">
            <p>The ultimate search engine to house all the hymns in the Coptic church</p>
            <img className="deaf" src={Deaf} alt="deaf" />
          </div>
        </div>

        <div className="flowSection">
          <row>
            <span>
              <div className="instructions">
                <p>Select a
                </p>
                <span>
                  {!selectedArtist ? <HeaderComponent placeholder="cantor" /> : <HeaderComponent placeholder="season" />}
                </span>
              </div>
            </span>

            <span>
              {selectedArtist && (
                <div className="instructions">
                  <p>return ←
                  </p>
                  <span>
                    <HeaderComponent placeholder="cantor" />
                  </span>
                </div>
              )}
            </span>

            <span>
              {selectedSeason && (
                <div className="instructions">
                  <p>return ←
                  </p>
                  <span>
                    <HeaderComponent placeholder="season" />
                  </span>
                </div>
              )}
            </span>
          </row>
        </div>

        <div className="TabList">
          <span style={{}}>
            {selectedArtist && !selectedSeason && renderArtist(selectedArtist, cantorContainerStyle, handleArtistClick, imgStyle, textStyle, tabIndex, hymns)}
          </span>

          <span>
            <li>
              {!selectedArtist && <button className="leftBtn">{leftArrow()}</button>}
            </li>

            <li>
              {!selectedArtist && !selectedSeason && (
                <>
                  {click === true
                    ? artistData.slice(4).map((artist, index) => (
                      <div key={index}>
                        {renderArtist(
                          artist,
                          cantorContainerStyle,
                          handleArtistClick,
                          imgStyle,
                          textStyle,
                          tabIndex
                        )}
                      </div>
                    ))
                    : artistData.slice(0, 4).map((artist, index) => (
                      <div key={index}>
                        {renderArtist(
                          artist,
                          cantorContainerStyle,
                          handleArtistClick,
                          imgStyle,
                          textStyle,
                          tabIndex
                        )}
                      </div>
                    ))}
                </>
              )}
            </li>

            <li>
              {!selectedArtist && <button className="rightBtn">{rightArrow()}</button>}
            </li>
          </span>

          {selectedArtist && !selectedSeason && renderSeasons(feastSeasons, psalmodySeasons)}

          {selectedSeason && renderHymn(hymns, artistData)}

          {!selectedArtist && <div className="progressContainer">
            <ProgressBar artistData={artistData} />
          </div>}

          <span>
            <img src={crossIcon} alt="cross" />
          </span>
        </div>

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