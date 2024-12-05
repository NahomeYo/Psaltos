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
import Audio from "./Audio.js";
import ArtistIcon from "./img/icons/artistIcon";
import Robe from "./img/robe.svg";
import HymnsData from "./output.json";
import ArtistData from "./artists.json";
import SeasonData from "./seasons.json";
import { useEffect, useState, useRef } from "react";
import crossIcon from "./img/icons/crossButton.svg"
import LoadingScreenAnim from "./loadingScreenAnim.js";

function App() {
  const [hymnData, setHymnData] = useState([]);
  const [hymn, setHymn] = useState("");
  const [artistData, setArtistData] = useState([]);
  const [filteredHymns, setFilteredHymns] = useState([]);
  const [typing, setTyping] = useState(false);
  const [selectedHymn, setSelectedHymn] = useState();
  const [selectedSeason, setSelectedSeason] = useState();
  const [selectedArtist, setSelectedArtist] = useState();
  const [click, setClick] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [expandedHymns, setExpandedHymns] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [seasonChoice, setSeasonChoice] = useState('annual');
  const [width, setWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  const [robePOS, setRobePOS] = useState(false);
  const [boxStyle, setBoxStyle] = useState({});
  const [contentsStyle, setContentsStyle] = useState({});
  const loadingScreenRef = useRef(null);
  const mainContentRef = useRef(null);

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
    setSelectedIndex();
  }, [click]);

  useEffect(() => {
    if (hymnData.length && artistData.length) {
      setTimeout(() => {
        setLoading(false);
        loadingScreenRef.current?.classList.add('fadeOut');
        mainContentRef.current?.classList.add('fadeIn');
      }, 0);
    }
  }, [hymnData, artistData]);

  useEffect(() => {
    const body = document.body;
    const content = document.querySelector('.contents');

    body.style.overflowY = loading ? 'hidden' : 'visible';
    content.style.display = loading ? 'none' : 'flex';

    return () => { body.style.overflowY = 'auto'; };
  }, [loading]);

  useEffect(() => {
    setRobePOS(!!selectedArtist);
  }, [selectedArtist]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const section = document.querySelector('.TabList span:nth-child(2) li:nth-child(2)');
    const tabs = document.querySelectorAll('.cantorTab001');
    const progress = document.querySelector('.progressContainer');
    const arrows = document.querySelectorAll('.leftBtn, .rightBtn');

    const isMobile = window.innerWidth < 1170;
    if (isMobile) {
      section.style.cssText = 'display: flex; flex-direction: column; justify-content: start; overflow-x: hidden; width: 72vw; height: 100vh; margin: 0;';
      arrows.forEach(arrow => arrow.style.display = 'none');
      progress.style.display = 'none';
      tabs.forEach(tab => {
        tab.style.width = '72vw';
        tab.style.marginTop = '0';
        tab.style.marginBottom = '0';
      });
    } else {
      section.style = '';
      progress.style = '';
      tabs.forEach(tab => {
        tab.style = '';
      });
    }
  }, [width]);

  useEffect(() => {
    const searchItems = document.querySelectorAll('.searchItem');
    const titles = document.querySelectorAll('.searchItem h2');
    const artistNames = document.querySelectorAll('.searchItem .artist h3');

    const isMobile = window.innerWidth <= 1170;
    if (isMobile) {
      searchItems.forEach(item => item.style.cssText = 'padding: 0vw 5vw 0vw 2.5vw; width: 70vw; margin-bottom: calc(var(--mini));');
      titles.forEach(t => t.style.cssText = 'white-space: wrap; width: min-content; text-align: center;');
      artistNames.forEach(name => name.style.cssText = 'white-space: wrap; text-align: end;');
    } else {
      searchItems.forEach(item => item.style = '');
      titles.forEach(t => t.style = '');
      artistNames.forEach(name => name.style = '');
    }
  }, [width]);

  useEffect(() => {
    switch (tabIndex) {
      case 0:
        setBoxStyle()
        setContentsStyle()
        break;
      case 1:
        setBoxStyle({
          width: '100%',
          transition: 'all 1s ease',
        })

        setContentsStyle({
          flexDirection: 'row',
          width: '100%',
          paddingBottom: '0',
          transition: 'all 1s ease',
        })
        break;
      default:
    }
  }, [selectedArtist, tabIndex]);

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
    ? hymnData.filter(hymn => hymn.artist === selectedArtist?.artistName && hymn.season === selectedSeason && (!selectedHymn || selectedHymn.name === hymn.name))
    : [];

  const handleArtistClick = (artist) => {
    if (tabIndex === 0) {
      setTabIndex(1);
    }
    setSelectedArtist(artist);
  };

  const itemsPerPage = 4;

  const nextFour = () => {
    if ((click + 1) * itemsPerPage < artistData.length) {
      setClick(click + 4);
    }
  };

  const prevFour = () => {
    if (click > 0) {
      setClick(click - 4);
    }
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

  const renderHymnBox = {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--primary-color)',
    borderRadius: '30px',
    height: 'min-content',
    width: '80vw',
  };

  const RenderArtist = ({
    selectedArtist,
    handleArtistClick,
    tabIndex,
    HeaderComponent,
    hymn,
    contentsStyle,
    boxStyle,
  }) => {

    return (
      <div
        className="cantorTab001"
        style={{
          ...boxStyle,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <div
          className="cantorContainer"
          style={contentsStyle}
          onClick={() => handleArtistClick(selectedArtist)}
        >
          <div className="topRow">
            {tabIndex === 2 && HeaderComponent ? (
              <HeaderComponent placeholder={hymn.name} customFont="Aladin" />
            ) : (
              <img
                src={selectedArtist.img}
                alt={`Artist ${selectedArtist.artistName}`}
              />
            )}
          </div>

          <div className="artist">
            <span>
              <ArtistIcon />
              <p>CANTOR</p>
            </span>
            <h3>
              {selectedArtist.artistName}
            </h3>
          </div>
        </div>

        <img
          style={{
            position: robePOS ? 'absolute' : 'relative',
            transition: 'position 1s ease-in-out',
            right: '0',
          }}
          className="robe"
          src={Robe}
          alt="robeImg"
        />
      </div>
    );
  };

  const renderHymn = (hymns, selectedArtist) => {
    return (
      <div className="hymnContainer">
        {(
          <div className="header">
            <HeaderComponent placeholder={selectedSeason} customFont='Aladin' />
          </div>
        )}

        {hymns.map((hymn, index) => (
          <div
            className="cantorTab001"
            style = {{width: '100%', marginRight: "0", marginBottom: 'var(--mini)'}}
            key={index}
            onClick={() => {
              if (expandedHymns !== index) {
                  setExpandedHymns(index);
              }
            }}
          >
            <div className="cantorContainer" style={renderHymnBox}>
              <div className="topRow">
                {expandedHymns === index && <img 
                style = {{ width: '100px', height: '100px' }} src={selectedArtist.img} alt={`Artist ${selectedArtist.artistName}`} />}
                <HeaderComponent placeholder={hymn.name} customFont='Aladin' />
              </div>

              {expandedHymns === index && <div className="artist">
                <span>
                  <ArtistIcon />
                  <p>CANTOR</p>
                </span>
                <h3>{selectedArtist?.artistName}</h3>
              </div>}

              {expandedHymns === index && <Audio />}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const seasonOptions = () => {
    return (
      <div className="feastContainer">
        {SeasonData.filter(s => s.group === seasonChoice).map((season) => {
          const isActive = false
          return (
            <div
              className="seasonItem"
              style={{
                background: isActive ? 'none' : 'none',
                padding: isActive ? '0vw' : '0vw',
                borderBottom: isActive ? 'none' : 'none',
                transition: 'background 0.3s, padding 0.3s, borderBottom 0.3s',
              }}
              // onMouseEnter={() => setSelectedIndex(index)}
              // onMouseLeave={() => setSelectedIndex(-1)}
              onClick={() => setSelectedSeason(season.seasonName)}
            >
              {seasonRender(season)}
              <HeaderComponent placeholder={season.seasonName} customFont='Aladin' />
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
                transition: 'all 0.5s ease',
              }}
              onMouseEnter={() => setSelectedIndex(index)}
              onMouseLeave={() => setSelectedIndex(-1)}
              onClick={() => setSelectedSeason(psalm)}
            >
              {seasonRender(psalm)}
              <HeaderComponent placeholder={psalm} customFont='Aladin' />
              <p>Psalmody</p>
            </div>
          );
        })}
      </div>
    )
  }

  const renderSeasons = () => {
    return (
      <div style={{}} className="seasonsContainer">
        <row>
          <column>
            <row>
              <t>Find the Hymn Season</t>
            </row>
            <row>
              {
                Array.from(new Set(SeasonData.map(s => s.group))).map(group => {
                  return (<b style={{background: seasonChoice === 1 ? 'var(--primary-color)' : 'var(--secondary-color)', transition: "1s ease"}}
                    onClick={() => setSeasonChoice(group)}>
                  {group}
                </b>)
                })
              }
            </row>
          </column>

          <column>
            <h3>Select</h3>
            <p>a Coptic season you're interested in and see Cantor</p>
            <h3>{selectedArtist?.artistName}'s</h3>
            <p>hymns</p>
          </column>
        </row>

        <row>
          {/* {seasonChoice === 1 && feastOptions(feastSeasons)} */}
          {/* {seasonChoice === 2 && psalmodyOptions(psalmodySeasons)} */}
          {seasonOptions()}
        </row>
      </div>
    );
  };

  const HeaderComponent = ({ placeholder, customFont }) => {

    return (
      <div className="headerContainer">
        <Cross />
        <h2 style={{ fontFamily: `${customFont}` }}>{placeholder}</h2>
        <Cross />
      </div>
    );
  };

  const seasonRender = (season) => {
    return <img src={season.img} alt={season.seasonName} />
    // switch (season) {
    //   case 'Nativity':
    //     return <img src={Nativity} alt="Nativity Season" />;
    //   case 'Resurrection':
    //     return <img src={Resurrection} alt="Resurrection Season" />;
    //   case 'Theophany':
    //     return <img src={Theophany} alt="Theophany Season" />;
    //   case 'Apostles Fast':
    //     return <img src={Apostles} alt="Apostles Fast Season" />;
    //   case 'Sunday Tasbeha (Midnight Praises)':
    //     return <img src={SundayTesbaha} alt="Sunday Tasbeha" />;
    //   case 'Weekday Tasbeha (Midnight Praises)':
    //     return <img src={Weekday} alt="Weekday Tasbeha" />;
    //   case 'Sunday Vespers Praise':
    //     return <img src={SundayVespers} alt="Sunday Vespers" />;
    //   default:
    //     return null;
    // }
  };

  const searchItem = () => (
    filteredHymns.slice(0, 10).map((hymn, index) => {
      const isActive = index === selectedIndex;

      return (
        <div
          key={index}
          className="searchItem"
          onMouseEnter={() => {
            setSelectedIndex(index);
          }}
          onMouseLeave={() => {
            setSelectedIndex(-1);
          }}
          onClick={() => {
            setSelectedHymn(hymn)
            setSelectedArtist(artistData.find(a => a.artistName === hymn.artist))
            setSelectedSeason(hymn.season)
            setTyping(false);
            setSelectedIndex(hymn);
          }}
          style={{
            background: isActive ? 'var(--thirdly-color)' : 'none',
            transition: 'background 0.3s ease'
          }}
        >
          <div className="topRow">
            <HeaderComponent placeholder={hymn.name} customFont={isActive ? 'Coptic' : 'Aladin'} />
          </div>
          <div className="artist">
            <span>
              <ArtistIcon />
              <p>CANTOR</p>
            </span>
            <h3>{hymn.artist}</h3>
          </div>
        </div>
      );
    })
  );

  const ProgressBar = ({ artistData }) => {
    const progressBars = [];

    for (let i = 0; i < artistData.length; i += 4) {
      progressBars.push(
        <div key={i}
          className="progress"
          style={{
            height: i === click ? '20px' : '5px',
            width: i === click ? '20px' : '5px',
            transition: "all 1s ease",
          }} />
      );
    }
    return <>{progressBars}</>;
  };

  return (
    <>
      {loading && <LoadingScreenAnim ref={loadingScreenRef} />}
      <div className="mainContainer" ref={mainContentRef}>
        <div className="contents">

          <div className="topSection" style={{ flexDirection: selectedArtist ? 'row' : 'column', marginBottom: 'var(--mini)', transition: '1s var(--smoothAnim)' }}>
            <Navbar selectedArtist={selectedArtist} />

            <div className="titleSearch"
              style={{ flexDirection: selectedArtist ? 'row' : 'column', marginBottom: 'var(--mini)', transition: '1s var(--smoothAnim)' }}>
              <div className="titleContainer" style={{ position: selectedArtist ? 'absolute' : 'relative', transition: '1s var(--smoothAnim)', opacity: selectedArtist ? 0 : 1 }}>
                <img className="mainLogo" src={logo} alt="logo" />
                <copt>yaltoc</copt>
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
                  <p style={{ position: selectedArtist ? 'absolute' : 'relative', transition: '1s ease', opacity: selectedArtist ? 0 : 1 }}>The ultimate search engine to house all the hymns in the Coptic church</p>
                  <img style={{ position: selectedArtist ? 'absolute' : 'relative', transition: '1s ease', opacity: selectedArtist ? 0 : 1 }} className="deaf" src={Deaf} alt="deaf" />
                </div>
              </div>
            </div>
          </div>

          <div className="flowSection">
            <row>

              <span>
                <HeaderComponent placeholder="cantor" customFont='Aladin' />
              </span>

              {selectedArtist && (
                <span style={{ left: `calc(${width} * 1)`, }}>
                  <HeaderComponent placeholder="season" customFont='Aladin' />
                </span>
              )}

              {selectedSeason && (
                <span style={{ left: `calc(${width} * 2)`, }}>
                  <HeaderComponent placeholder="hymn" customFont='Aladin' />
                </span>
              )}

            </row>
          </div>

          <div className="TabList"
            style={{
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <span>
            </span>

            <span>
              <li>
                {!selectedArtist && <button className="leftBtn"
                  style={{
                    transform: 'all 1s ease'
                  }}>{leftArrow()}</button>}
              </li>

              <li style={{
                display: 'flex',
                transition: 'all 0.3s ease-in-out',
              }}>
                {!selectedArtist && !selectedSeason && (
                  artistData.map((artist, index) => (
                    <div key={index}
                      style={{
                        transform: click
                          ? 'translateX(-72vw)'
                          : 'translateX(0)',
                        transition: 'all 0.3s ease-in-out',
                      }}>
                      <RenderArtist
                        selectedArtist={artist}
                        handleArtistClick={handleArtistClick}
                        tabIndex={tabIndex}
                        hymns={hymns}
                        contentsStyle={contentsStyle}
                        boxStyle={boxStyle}
                      />
                    </div>
                  )))}
              </li>

              <li>
                {!selectedArtist && <button className="rightBtn"
                  style={{
                    transform: 'all 1s ease',
                  }}
                >{rightArrow()}</button>}
              </li>
            </span>

            {selectedArtist &&
              <RenderArtist
                selectedArtist={selectedArtist}
                handleArtistClick={handleArtistClick}
                tabIndex={tabIndex}
                hymns={hymns}
              />
            }
            {selectedArtist && !selectedSeason && renderSeasons(feastSeasons, psalmodySeasons)}

            {selectedSeason && renderHymn(hymns, selectedArtist)}


            {!selectedArtist && <div className="progressContainer">
              <ProgressBar artistData={artistData} />
            </div>}

            <span>
              <img src={crossIcon} alt="cross" />
            </span>
          </div>
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

        <img className="Jesus" src={jesus} alt="Jesus" />
        <img className="churchImg" src={Church} alt="church" />
      </div>
    </>
  );
}

export default App;