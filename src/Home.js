

import './App.css';
import "./animation.css";
import "./media.css";
import "./interfaceMain.css";
import { profileData } from './profiles.js';
import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import WavesurferPlayer from '@wavesurfer/react';
import { AuthContext } from './AuthContext.js';
import { getPlaylists, getLikes, resolveMediaUrl, addPlaylistItem, getHymns, likeHymn, unlikeHymn, proxyAudioUrl } from './api.js';
import { LoadingOverlay } from './LoadingOverlay.js';

import DeaconsBackImg from "./img/deaconsBack.jpg";
import DeaconLibraryImg from "./img/deaconLibrary.jpg";
import DeaconProcessionImg from "./img/deaconProcession.png";
import SectionMarker from "./img/Group 4.png";
import psaltosIcon from "./img/logo.svg";
import coverBorder from "./img/coverBorder.png";
import standEdge from "./img/edge.svg";
import Stool from "./img/stool.svg";
import deaconStand from "./img/board.png";
import heart from "./img/heart.svg";
import repost from "./img/repost.svg";
import share from "./img/share.svg";
import copyLink from "./img/copyLink.svg";
import addToQueue from "./img/addToQueue.svg";
import Robe from "./img/robe.svg";
import searchIcon from "./img/searchIcon.svg";

import {
  Logo,
  ArtistIcon,
  CopticCross,
  HamburgerIcon,
  SearchIcon,
  CrossHeader,
  TitleCrossHeader,
  CrossSymbol,
  CrossButton
} from './icons.js';

export function CarouselComponent() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Where Coptic Hymns Live",
      description: "Find coptic hymns through cantors or search.",
      image: DeaconsBackImg
    },
    {
      title: "Coptic Translator",
      description: "Translate English to Coptic (vice versa), and write Coptic in English letters.",
      image: DeaconLibraryImg
    },
    {
      title: "Build a library of Coptic hymns",
      description: "Save your favorite hymns and cantors all in one place.",
      image: DeaconProcessionImg
    }
  ];

  return (
    <div className="carouselContainer" style={{
      position: "relative",
      width: "100%",
      height: "45vh",
      overflow: "hidden",
      borderRadius: "var(--border)",
      paddingBottom: "var(--sectionSpacing)",
    }}>

      {slides.map((slide, index) => (
        <div
          key={index}
          className="carouselSlide"
          onClick={() => setCurrentSlide(index)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            transform: `translateX(${(index - currentSlide) * 100}%)`,
            transition: "all 1s ease-in-out",
          }}
        >

          
          <div
            className="carouselContent"
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
              width: "50%",
              margin: "var(--sectionSpacing) 0 0 var(--sectionSpacing)",
              zIndex: 4,
              gap: "var(--sectionSpacing)",
            }}>

            <span style={{
              position: "relative",
            }}>
              <t2 style={{
                fontSize: "2.5rem",
                color: "var(--fourthy)",
                margin: 0,
                textAlign: "justify",
                textJustify: "inter-word",
                whiteSpace: "wrap",
              }}>
                {slide.title}
              </t2>
              <p style={{
                color: "var(--fifthly)",
                position: "relative",
                textAlign: "justify",
                textJustify: "inter-word",
                fontFamily: "BoucherieSans",
                margin: 0,
              }}>
                {slide.description}
              </p>
            </span>

            {(index === 0) &&
              (<span style={{ display: "flex", gap: "var(--padding)", margin: 0, width: "100%" }}>
                <div className="primaryButton" style={{ flexGrow: 1 }}>Cantors</div>
                <div className="secondaryButton" style={{ flexGrow: 1 }}>Search</div>
              </span>)}
          </div>

          
          <div style={{
            position: "absolute",
            zIndex: 3,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg,rgba(43, 84, 102, 1) 19%, rgba(43, 84, 102, 0.46) 100%)",
          }} />

          <img
            src={slide.image}
            alt={slide.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      ))}

      
      <div style={{
        position: "absolute",
        bottom: "0",
        left: "50%",
        transform: "translateX(-50%) translateY(-20px)",
        display: "flex",
        gap: "10px",
        zIndex: 3,
      }}>

        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              border: "2px solid var(--fifthly)",
              background: currentSlide === index ? "var(--fifthly)" : "transparent",
              cursor: "pointer",
              transition: "all 0.3s ease-in-out"
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export function SearchBarComp(props) {
  const profiles = profileData();
  const [hymns, setHymns] = useState([]);
  const [typing, setTyping] = useState("");
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    let active = true;
    const loadHymns = async () => {
      try {
        const data = await getHymns();
        if (!active) return;
        const mapped = (Array.isArray(data) ? data : []).map((hymn) => ({
          englishTitle: hymn.englishTitle || hymn.title || '',
          copticTitle: hymn.copticTitle || hymn.coptic_title || '',
          audioFileLink: hymn.audioFileLink || hymn.audio_url || '',
          season: hymn.season || '',
          artist: hymn.artist || hymn.cantor || '',
        }));
        setHymns(mapped);
      } catch (err) {
        if (!active) return;
        setHymns([]);
      }
    };
    loadHymns();
    return () => {
      active = false;
    };
  }, []);

  function searchHymn(e) {
    const value = e.target.value;
    if (value.trim() === "") {
      setTyping("");
      setDropdown(false);
    } else {
      setTyping(value);
      if (!dropdown) {
        setDropdown(true);
      }
    }
  }

  const hymnsWithArtists = hymns.map((hymn) => {
    let artist = hymn.artist ? hymn.artist.replaceAll("_", " ") : "";
    let imgLink = "";
    let audioData = hymn.audioFileLink;

    profiles.forEach((person) => {
      if (audioData.includes(person.artistName)) {
        artist = person.artistName.replaceAll("_", " ");
        imgLink = person.img;
      }
    });

    return { ...hymn, artist: artist || "Unknown Cantor", imgLink };
  });

  const filteredHymns = hymnsWithArtists
    .filter(hymn => hymn.englishTitle.includes(typing))
    .slice(0, 10);

  function dropdownContainer() {
    return (
      <div className="dropdownContainer" style={{
        paddingTop: "var(--padding)",
        margin: 0,
        overflow: "hidden",
        display: "flex",
        width: "100%",
        flexDirection: "column",
        alignItems: "start",
        position: "absolute",
        background: "var(--fourthy)",
        overflowY: "visible",
        overflowX: "hidden",
        height: "50vh",
        borderRadius: "0 0 0 var(--border)"
      }}>
        {filteredHymns.map((hymn, index) => (
          <div key={index} className="titleArtist" style={{
            display: "flex",
            gap: "var(--padding)",
            marginBottom: "var(--padding)",
            width: "95%",
            borderRadius: "0 40px 40px 0",
            paddingLeft: "var(--border)"
          }}>
            <img src={hymn.imgLink} style={{ width: "1rem", height: "100%", borderRadius: "10px" }} alt="artist" />
            <div style={{ flexDirection: "column", display: "flex", gap: "0" }}>
              <h3 style={{ whiteSpace: "nowrap", alignContent: "center", color: "var(--thirdly)" }}>
                {hymn.englishTitle}
              </h3>
              <p2 style={{ whiteSpace: "nowrap", alignContent: "center" }}>
                {hymn.artist}
              </p2>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: props.barWidth }}>
      <div className="searchBar" style={{
        height: 'min-content',
        display: 'flex',
        flexDirection: "column",
        alignItems: 'center',
        borderRadius: dropdown ? "var(--border) var(--border) 0 0" : props.borderRadius,
        overflow: 'hidden',
        background: props.searchBarBackground,
        borderBottom: `3px solid ${props.borderColor}`,
        flexBasis: "100%",
        flexGrow: 2,
        zIndex: 10
      }}>
        <span style={{
          display: "flex",
          position: 'relative',
          alignItems: 'center',
          justifyContent: "start",
          padding: "var(--padding)",
          width: "100%",
          gap: "0.25rem",
          background: "#bfd5e1",
        }}>
          <span style={{ margin: "0 var(--border)" }}>
            <SearchIcon fill={props.searchIconFill} />
          </span>
          <input
            placeholder="Search for cantors and hymns"
            className="typeBox"
            style={{ border: 'none', width: "100%", color: props.textColor, background: 'transparent', outline: 'none' }}
            value={typing}
            onChange={searchHymn}
          />
          {typing && (
            <button
              onClick={() => {
                setTyping("");
                setDropdown(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: props.textColor,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginRight: 'var(--border)'
              }}
            >
              <h3>X</h3>
            </button>
          )}
        </span>
      </div>
      {dropdown && dropdownContainer()}
    </div>
  );
}

export function Home({ height, showSearch, loading, setLoading }) {

  const { authenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const profiles = profileData();

  const [searchBarHeight, setSearchBarHeight] = useState();
  const [seasonLoad, setSeasonLoad] = useState(false);
  const [feastLoad, setFeastLoad] = useState(false);
  const [menuHeight, setMenuHeight] = useState("0px");
  const [artistPage, setArtistPage] = useState(0);
  const [likedHymns, setLikedHymns] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [likes, setLikes] = useState([]);
  const [libraryTab, setLibraryTab] = useState('playlists');
  const [librarySearch, setLibrarySearch] = useState('');
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);
  const [libraryStatus, setLibraryStatus] = useState('');
  const [backendHymns, setBackendHymns] = useState([]);
  const [hymnIdMap, setHymnIdMap] = useState({});
  const [catalogHymns, setCatalogHymns] = useState([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [hymnsLoading, setHymnsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [translateInput, setTranslateInput] = useState('');
  const [translateOutput, setTranslateOutput] = useState('');
  const [leftLang, setLeftLang] = useState('english');
  const [rightLang, setRightLang] = useState('coptic-english');

  const [selectedArtist, setSelectedArtist] = useState(null);
  const [seasonIndex, setSeasonIndex] = useState(null);
  const [selectedFeast, setSelectedFeast] = useState(null);
  const [selectedHymn, setSelectedHymn] = useState(null);

  const [displayArtistSeasons, setDisplayArtistSeasons] = useState(false);
  const [displayArtistFeasts, setDisplayArtistFeasts] = useState(false);
  const [displayArtistHymns, setDisplayArtistHymns] = useState(false);
  const [displayHymnAudio, setDisplayHymnAudio] = useState(false);
  const [feastSelections, setFeastSelections] = useState([]);
  const [audioPlayerExpanded, setAudioPlayerExpanded] = useState(false);

  const [resize, setResize] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 1440 && window.innerWidth >= 1000) return 1;
      if (window.innerWidth <= 1000 && window.innerWidth >= 465) return 2;
    }
    return 1;
  });

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    if (width <= 1440 && width >= 1000) {
      setResize(1);
    } else if (width <= 1000 && width >= 465) {
      setResize(2);
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [showSearch]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const handleLikeToggle = async (hymnId) => {
    const backendId = hymnIdMap[hymnId] || hymnId;
    if (typeof backendId !== 'number') {
      setLibraryStatus('This hymn is not in the upload library yet.');
      return;
    }
    await toggleLike(backendId);
  };

  const handleDownload = async (hymnUrl, hymnTitle) => {
    console.log('Download clicked - auth removed');
  };

  const hymnsWithArtists = catalogHymns.map((hymn) => {
    let artist = hymn.artist ? hymn.artist.replaceAll("_", " ") : "";
    let imgLink = "";
    let audioData = hymn.audioFileLink;

    profiles.forEach((person) => {
      if (audioData.includes(person.artistName)) {
        artist = person.artistName.replaceAll("_", " ");
        imgLink = person.img;
      }
    });

    return { ...hymn, artist: artist || "Unknown Cantor", imgLink };
  });

  const filterArtists = hymnsWithArtists.map((hymn) => {
    let hymnCopy = { ...hymn };
    delete hymnCopy.englishTitle;
    delete hymnCopy.copticTitle;
    delete hymnCopy.audioFileLink;
    return hymnCopy;
  });

  const artistAndSeasonOnlyArray = Array.from(
    new Set(filterArtists.map(hymn => JSON.stringify(hymn)))
  ).map(hymn => JSON.parse(hymn));

  const removeSeasons = artistAndSeasonOnlyArray.map((hymn) => {
    let hymnCopy = { ...hymn };
    delete hymnCopy.season;
    return hymnCopy;
  });

  const artistOnlyArray = Array.from(
    new Set(removeSeasons.map(hymn => JSON.stringify(hymn)))
  ).map(hymn => JSON.parse(hymn));

  const artistsPerPage = 4;
  const totalPages = Math.ceil(artistOnlyArray.length / artistsPerPage);
  const handleNextArtists = () => {
    setArtistPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };
  const handlePrevArtists = () => {
    setArtistPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNavMarkerClick = (index) => {

    function animateOutBoxes(className) {
      const boxes = document.querySelectorAll(`.${className}`);
      boxes.forEach((box) => {
        box.style.transform = "translateY(-100px)";
        box.style.opacity = "0";
        box.style.display = "";
        box.style.width = "";
        if (box.querySelector('img')) box.querySelector('img').style.filter = "";
      });
    }

    if (index === 0 && selectedArtist !== null) {

      animateOutBoxes('seasonBox');
      animateOutBoxes('feastBox');
      animateOutBoxes('hymnRecording');
      setSelectedArtist(null);
      setSeasonIndex(null);
      setSelectedFeast(null);
      setSelectedHymn(null);
      setDisplayArtistSeasons(false);
      setDisplayArtistFeasts(false);
      setDisplayArtistHymns(false);
      setDisplayHymnAudio(false);
      setSeasonLoad(false);
      setFeastLoad(false);
    } else if (index === 1 && seasonIndex !== null) {

      animateOutBoxes('feastBox');
      animateOutBoxes('hymnRecording');
      setSeasonIndex(null);
      setSelectedFeast(null);
      setSelectedHymn(null);
      setDisplayArtistFeasts(false);
      setDisplayArtistHymns(false);
      setDisplayHymnAudio(false);
      setFeastLoad(false);
    } else if (index === 2 && selectedFeast !== null) {

      animateOutBoxes('hymnRecording');
      setSelectedFeast(null);
      setSelectedHymn(null);
      setDisplayArtistHymns(false);
      setDisplayHymnAudio(false);
      setFeastLoad(false);
    } else if (index === 3 && selectedHymn !== null) {

      setSelectedHymn(null);
      setDisplayHymnAudio(false);
    }
  };
  let seasonArray = [];
  hymnsWithArtists.map((hymn) => {
    let seasonFix = hymn.season.substring(0, hymn.season.indexOf("-"));
    seasonArray.push(seasonFix);
  });
  const seasonsOnlyArray = Array.from(new Set(seasonArray));

  let feastArray = [];
  hymnsWithArtists.map((hymn) => {
    let feastFix = hymn.season.substring(hymn.season.indexOf("-") + 1);
    feastFix.trim();
    feastArray.push(feastFix);
  });
  const feastOnlyArray = Array.from(new Set(feastArray));

  useEffect(() => {
    const robes = document.querySelectorAll('.robeImg');
    const tabContent = document.querySelectorAll('.artistTab span');

    if (tabContent && robes) {
      tabContent.forEach((t, index) => {
        let tabHeight = t.getBoundingClientRect().height + "px";
        robes[index].style.height = `calc(${tabHeight} * 1.8)`;
      });
    }
  }, [filterArtists]);

  useEffect(() => {
    const searchBarElement = document.querySelector(".searchBar");
    if (searchBarElement) {
      const heightValue = searchBarElement.getBoundingClientRect().height + "px";
      setSearchBarHeight(heightValue);
    }
  }, []);

  useEffect(() => {
    const trackMenuElement = document.querySelector(".trackMenu");
    if (trackMenuElement) {
      let calcHeight = trackMenuElement.getBoundingClientRect().height + "px";
      setMenuHeight(calcHeight);
    }
  }, [selectedHymn]);

  useEffect(() => {
    if (selectedArtist !== null) setDisplayArtistSeasons(true);
  }, [selectedArtist]);

  useEffect(() => {
    const sectionNav = document.querySelector(".hymnSearchNav li:nth-of-type(1)");
    if (sectionNav && (selectedArtist !== null)) {
      sectionNav.style.transform = "translateY(0)";
      sectionNav.style.opacity = "1";
    }
  }, [displayArtistSeasons]);

  useEffect(() => {
    const sectionNav = document.querySelector(".hymnSearchNav li:nth-of-type(2)");
    if (sectionNav && (seasonIndex !== null)) {
      sectionNav.style.transform = "translateY(0)";
      sectionNav.style.opacity = "1";
    }
  }, [displayArtistFeasts]);

  useEffect(() => {
    const sectionNav = document.querySelector(".hymnSearchNav li:nth-of-type(3)");
    if (sectionNav && (selectedFeast !== null)) {
      sectionNav.style.transform = "translateY(0)";
      sectionNav.style.opacity = "1";
    }
  }, [displayArtistHymns]);

  useEffect(() => {
    const seasonBoxes = document.querySelectorAll(".seasonBox");
    if (seasonBoxes) {
      seasonBoxes.forEach((s, index) => {
        if (index !== seasonIndex) {
          s.style.display = "none";
        }
      });
    }
    if (seasonIndex !== null) setDisplayArtistFeasts(true);
  }, [seasonIndex]);

  useEffect(() => {
    const feastBoxArray = document.querySelectorAll(".feastBox");
    if (feastBoxArray) {
      feastBoxArray.forEach((box, index) => {
        if (index !== selectedFeast) {
          box.style.display = "none";
        } else {
          box.style.width = "100%";
          const img = box.querySelector('img');
          if (img) {
            img.style.filter = "saturate(0%)";
          }
        }
      });
    }
  }, [selectedFeast]);

  useEffect(() => {
    const seasonBoxes = document.querySelectorAll(".seasonBox");
    let delay = 0;

    if (seasonBoxes && seasonLoad) {
      for (let i = 0; i < seasonBoxes.length; i++) {
        delay += 0.05;
        seasonBoxes[i].classList.add('fadeIn');
        seasonBoxes[i].style.animationDelay = `${delay}s`;
      }
    }
  }, [seasonLoad]);

  useEffect(() => {
    const feastBoxes = document.querySelectorAll(".feastBox");
    let delay = 0;

    if (feastBoxes && feastLoad) {
      for (let i = 0; i < feastBoxes.length; i++) {
        delay += 0.05;
        feastBoxes[i].classList.add('fadeIn');
        feastBoxes[i].style.animationDelay = `${delay}s`;
      }
    }
  }, [feastLoad]);

  const circleComp = () => {
    return <LoadingOverlay show={true} />;
  };

  const seasonsOfArtist = () => {
    function hymnThumbnail(season) {
      let seasonFix = season.toLowerCase()
      let imgSrc

      if (seasonFix.includes("annual")) {
        imgSrc = "https://images.squarespace-cdn.com/content/v1/5b68b2cd25bf0272973242c4/1725682425215-DZL92V7KN8G1D30Z953L/Melbourne+Website+final_-2.jpg?format=750w"
      } else if (seasonFix.includes("fasts")) {
        imgSrc = "https://images.squarespace-cdn.com/content/v1/5b68b2cd25bf0272973242c4/1674782187510-50SI2W70D7EJYNQS6ZUL/Paralyzed+man_-4.jpg?format=2500w"
      } else if (seasonFix.includes("holy week")) {
        imgSrc = "https://images.squarespace-cdn.com/content/v1/5b68b2cd25bf0272973242c4/1587951600088-YBFO0PAL7RG6CUTRT2ZH/Anastasis+Cross+comp-11.jpg?format=2500w"
      } else if (seasonFix.includes("liturgies")) {
        imgSrc = "https://scontent-sea5-1.xx.fbcdn.net/v/t51.75761-15/504502424_18085772221664544_2144039370302935008_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=gQ8cptzrxXUQ7kNvwEwnF5U&_nc_oc=AdmbHmH_bjs0zCq7V3kGNZi3SdH73mjzRgvByjU9ZIlZQ1iY4x3t1EtEZIRnc76Csuw&_nc_zt=23&_nc_ht=scontent-sea5-1.xx&_nc_gid=4fdp6OFU0-QcE0zX69DMvA&oh=00_AfXRpSGovun7_un6DmOmsbaweRDQojMZKoVoyL4diOHrlA&oe=68A56FAB"
      } else if (seasonFix.includes("major feasts of the lord")) {
        imgSrc = "https://images.squarespace-cdn.com/content/v1/5b68b2cd25bf0272973242c4/1587951600532-FFA99K0SOY0HRHW6PZ2J/Anastasis+Cross+comp-9.jpg?format=2500w"
      } else if (seasonFix.includes("minor feasts of the lord")) {
        imgSrc = "https://images.squarespace-cdn.com/content/v1/5b68b2cd25bf0272973242c4/1699465745355-76BVJS2HQNKHZS8J6JLU/detail+ascension.jpg?format=2500w"
      } else {
        imgSrc = "https://images.squarespace-cdn.com/content/v1/5b68b2cd25bf0272973242c4/1674782211871-MGCBENTSYQAT8P627H6G/Moses+Burning+Bush-4.jpg?format=2500w"
      }

      return imgSrc
    }

    return (
      <div style={{ display: 'flex', width: '100%', height: 'min-content', gap: "var(--padding)", position: "relative", alignItems: "start", flexGrow: 1 }}>

        {(selectedArtist !== null && !seasonLoad) && circleComp()}

        {seasonsOnlyArray.map((season, index) => {

          function ohYes() {
            setSeasonIndex(index)
            setFeastLoad(false)

            setTimeout(() => {
              setFeastLoad(true)
            }, 1000)
          }

          let isSeasonSelected = seasonIndex !== null && seasonIndex === index

          function expandImg(event) {
            event.currentTarget.style.flexGrow = 1;
            event.currentTarget.style.flexBasis = "100%";
            event.currentTarget.style.height = "100%";

            const titleText = event.currentTarget.querySelector("h1");
            if (titleText) {
              titleText.style.opacity = "100%";
              titleText.style.transform = "translateY(0px)";
              titleText.style.transition = "0.5s all ease-in-out";
            }
          }

          function shrinkenImg(event) {
            event.currentTarget.style.flexGrow = 0;
            event.currentTarget.style.flexBasis = "15%";
            event.currentTarget.style.height = "100%";

            const titleText = event.currentTarget.querySelector("h1");
            if (titleText) {
              titleText.style.opacity = "0";
              titleText.style.transform = "translateY(-100px)";
            }
          }

          return (
            <>
              <div className="seasonBox" key={index} onMouseOver={!isSeasonSelected ? expandImg : null} onMouseLeave={!isSeasonSelected ? shrinkenImg : null} onClick={ohYes}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  flexBasis: isSeasonSelected ? "100%" : "15%",
                  flexGrow: isSeasonSelected ? 1 : 0.5,
                  transition: "0.25s all ease-in-out",
                  alignContent: "center", opacity: 0,
                  transform: "translateY(100px)",
                  height: isSeasonSelected ? "min-content" : "100%",
                }}>
                <h1 style={{ position: "relative", width: '100%', zIndex: 5, textAlign: "center", opacity: 0, transform: "translateY(-100px)", transition: "0.25s all ease-in-out" }}>{season}</h1>
                <img src={hymnThumbnail(season)} className="seasonThumbnail" alt="hymnThumbail" style={{ left: 0, top: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: isSeasonSelected ? '50% 75%' : '50% 50%', filter: isSeasonSelected ? "blur(10px) grayscale(80%) contrast(50%)" : "blur(0) grayscale(0%) contrast(100%)", position: "absolute" }} />
              </div>
            </>
          )
        })}

      </div>
    )
  }

  useEffect(() => {
    const feasts = []
    const selectedSeason = seasonsOnlyArray[seasonIndex]
    const selectedArtistIndex = artistOnlyArray[selectedArtist] && artistOnlyArray[selectedArtist].artist

    hymnsWithArtists.map((hymn) => {
      if (hymn.season.includes(selectedSeason) && hymn.artist === (selectedArtistIndex)) {
        const feastName = hymn.season.substring(hymn.season.indexOf("-") + 1, hymn.season.length + 1)
        feasts.push(feastName)
      }
    })

    const feastArray = Array.from(new Set(feasts));

    const feastChoices = feastArray.map((name, index) => {
      let nameFix = name.trim()

      function createThumbnail(i) {
        let imgSrc

        if (i === "Congregation Responses") {
          imgSrc = "https://scontent-sea5-1.xx.fbcdn.net/v/t51.75761-15/491898933_18080780437664544_1678000177681328722_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=JZSv9isZ-cQQ7kNvwEqnwBz&_nc_oc=Adm8jW5_gm8hN0gB96-cz0CPEyxjXJev0HKn4IACaMI7v5ZOoQdOa37k1OjtV5KYbrk&_nc_zt=23&_nc_ht=scontent-sea5-1.xx&_nc_gid=iY-GDHaR65EwrVHs3lo5DQ&oh=00_AfXGoHZUmwdHNks2FCYDfgDJ8WppCz0giqwcH89QyPbHQA&oe=68A41BDC"
        } else if (i === "Verses of Cymbals and Doxologies") {
          imgSrc = "https://images.squarespace-cdn.com/content/v1/5b68b2cd25bf0272973242c4/1731183335972-6ARXQVN23HOAAU7UXXMT/Christ%2Bthe%2BGreat%2BArchitect.jpg"
        } else if (i === "Deacon Responses") {
          imgSrc = "https://live.staticflickr.com/65535/54737682329_57a9164a7e_c.jpg"
        } else if (i === "Apostles") {
          imgSrc = "https://scontent-sea1-1.xx.fbcdn.net/v/t39.30808-6/504737500_1282490456927001_908662529514116063_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=rdJg2jwNtaYQ7kNvwF8Hcg5&_nc_oc=Adn3C0FOcJfvIM9rAsSDY_SRRtD9nQ6ZXpyJjXK7tWuJGoPSfYx2iMmyZsFd6flm3tM&_nc_zt=23&_nc_ht=scontent-sea1-1.xx&_nc_gid=WjIEdBjdnEWdZQl7MvZbxg&oh=00_AfXN7yzw6F2ZkNaarzFT-HDrNlZO2GHM-EkjfrAfxZWwZw&oe=68A3F958"
        } else if (i === "Great Lent") {
          imgSrc = "https://images.squarespace-cdn.com/content/v1/5b68b2cd25bf0272973242c4/1731183278235-S09TCJ3QHMX450YFIXZS/Christ+True+Physician+detail_-2.jpg"
        } else if (i === "Jonah") {
          imgSrc = "https://i.pinimg.com/1200x/d2/0e/e8/d20ee84f1120931128efc3a353139086.jpg"
        } else if (i === "Annunciation") {
          imgSrc = "https://live.staticflickr.com/65535/54738232749_81f4144a31.jpg"
        } else if (i === "Ascension") {
          imgSrc = "https://live.staticflickr.com/65535/54738359305_e6bac6cb0b.jpg"
        } else if (i === "Nativity") {
          imgSrc = "https://scontent-sea5-1.xx.fbcdn.net/v/t1.6435-9/151700548_185113376744927_4609794502168063286_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=QUJgRMazweMQ7kNvwHos0A2&_nc_oc=Adm-x0uwntEpwsTP7vhQqhyZfzUjfBxiJYjxtXvLt7El3fh9R0JtjsX9wOTBAxfVpu0&_nc_zt=23&_nc_ht=scontent-sea5-1.xx&_nc_gid=i94wIwCfld2zvvclTACSRA&oh=00_AfU5cl1E7T8zBbzycTTxcmEifqKl7uquWX4rNNerhLWYUw&oe=68C5AB66"
        } else if (i === "Palm Sunday") {
          imgSrc = "https://images.squarespace-cdn.com/content/v1/5b68b2cd25bf0272973242c4/1652822346457-8X3JKJBYN4HWR1M5H9VY/Palm+Sunday+Rhodes+comp.jpg?format=750w"
        } else if (i === "Pentecost") {
          imgSrc = "https://images.squarespace-cdn.com/content/v1/5b68b2cd25bf0272973242c4/1685765610395-VWGNE5AQKICK3L5RVWGO/Rhodes+Pentecost+comp.jpg?format=750w"
        } else if (i === "Glorification for Saint Mary") {
          imgSrc = "https://images.squarespace-cdn.com/content/v1/5b68b2cd25bf0272973242c4/1699465749666-ITRFTJETN69CLSPC8VF5/detail+theotokos.jpg"
        } else if (i === "Lazarus Saturday") {
          imgSrc = "https://images.squarespace-cdn.com/content/v1/5b68b2cd25bf0272973242c4/1587951600532-FFA99K0SOY0HRHW6PZ2J/Anastasis+Cross+comp-9.jpg?format=1500w"
        } else if (i === "Papal Hymns") {
          imgSrc = "https://static.wixstatic.com/media/412dab_3053c0defc5a4ceca112711684f11ad6~mv2.jpg/v1/fill/w_1197,h_844,al_c,q_85,usm_1.20_1.00_0.01,enc_avif,quality_auto/412dab_3053c0defc5a4ceca112711684f11ad6~mv2.jpg"
        } else if (i.includes("Liturgy")) {
          imgSrc = "https://scontent-sea1-1.xx.fbcdn.net/v/t51.75761-15/490699251_18081102127664544_6129274112033468471_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=FSRyioC26ekQ7kNvwGJ5HrR&_nc_oc=AdnP3-CTXTAaAh1-nzr1LeDtf13aCUo_i_21tPoVXg169cyXaEBPbyi9ga5hs2bu1Tg&_nc_zt=23&_nc_ht=scontent-sea1-1.xx&_nc_gid=qRvpLAG_R2xB8Irgas-hGQ&oh=00_AfVp1BbB5fcCQavb9aaPENsQG44SHjlhIUEIJjJW1clDZg&oe=68A402C9"
        } else if (i.includes("Entry Into Egypt")) {
          imgSrc = "https://scontent-sea1-1.xx.fbcdn.net/v/t51.75761-15/490699251_18081102127664544_6129274112033468471_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=FSRyioC26ekQ7kNvwGJ5HrR&_nc_oc=AdnP3-CTXTAaAh1-nzr1LeDtf13aCUo_i_21tPoVXg169cyXaEBPbyi9ga5hs2bu1Tg&_nc_zt=23&_nc_ht=scontent-sea1-1.xx&_nc_gid=qRvpLAG_R2xB8Irgas-hGQ&oh=00_AfVp1BbB5fcCQavb9aaPENsQG44SHjlhIUEIJjJW1clDZg&oe=68A402C9"
        } else {
          imgSrc = "https://scontent-sea1-1.xx.fbcdn.net/v/t51.75761-15/490699251_18081102127664544_6129274112033468471_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=FSRyioC26ekQ7kNvwGJ5HrR&_nc_oc=AdnP3-CTXTAaAh1-nzr1LeDtf13aCUo_i_21tPoVXg169cyXaEBPbyi9ga5hs2bu1Tg&_nc_zt=23&_nc_ht=scontent-sea1-1.xx&_nc_gid=qRvpLAG_R2xB8Irgas-hGQ&oh=00_AfVp1BbB5fcCQavb9aaPENsQG44SHjlhIUEIJjJW1clDZg&oe=68A402C9"
        }
        return imgSrc
      }

      function feastClick() {
        setSelectedFeast(index);
        setDisplayArtistHymns(true);

        const blur = document.querySelectorAll(".blurBackdrop");

        blur.forEach((b) => {
          b.style.backdropFilter = "blur(5px)";
        })
      }

      return (
        <>
          <div className="feastBox" onClick={feastClick}
            style={{
              position: 'relative',
              overflow: 'hidden',
              flexBasis: selectedFeast ? "100%" : "15%",
              flexGrow: selectedFeast ? 1 : 0.5,
              transition: "0.25s all ease-in-out",
              borderRadius: 'var(--border)',
              border: "var(--spacing) solid var(--fifthly)",
              alignContent: "center", opacity: 0,
              transform: "translateY(100px)",
              height: "100%",
            }}>
            <div className="gradientBackdrop"></div>
            <div className="blurBackdrop"></div>
            <h1 style={{ position: "relative", textAlign: "center", zIndex: "1", transition: "all 1s ease-in-out", whiteSpace: selectedHymn ? "nowrap" : "", alignSelf: "center" }}>{nameFix}</h1>
            <img src={createThumbnail(nameFix)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 50%", borderRadius: "var(--padding)", position: "absolute", left: 0, top: 0 }} />
          </div>
        </>
      )
    })

    setFeastSelections(feastChoices);

  }, [seasonIndex, artistOnlyArray, selectedArtist])

  useEffect(() => {
    const feastBoxArray = document.querySelectorAll(".feastBox");

    if (feastBoxArray) {
      feastBoxArray.forEach((box, index) => {
        if (index === feastBoxArray.length - 1) {
          box.style.flexGrow = 1;
        }
      })
    }

  }, [feastSelections])

  const feastsOfSeasons = () => {
    return (
      <div className="feastContainer" style={{ width: "100%", display: "flex", flexWrap: "wrap", gap: "var(--padding)", position: "relative", justifyContent: "space-between", height: "100%", margin: 0, flexGrow: 1 }}>
        {((seasonIndex !== null) && !feastLoad) && circleComp()}
        {feastSelections}
      </div>
    )
  }

  useEffect(() => {
    const searchBarElement = document.querySelector(".searchBar")

    if (searchBarElement) {
      const heightValue = searchBarElement.getBoundingClientRect().height + "px"
      setSearchBarHeight(heightValue)
    }
  }, [])

  useEffect(() => {
    const trackMenuElement = document.querySelector(".trackMenu")

    if (trackMenuElement) {
      let calcHeight = trackMenuElement.getBoundingClientRect().height + "px"
      setMenuHeight(calcHeight)
    }
  }, [selectedHymn])

  useEffect(() => {
    let active = true;
    if (!authenticated) {
      setLibraryLoading(false);
      setPlaylists([]);
      setLikes([]);
      return;
    }
    setLibraryLoading(true);

    const loadLibrary = async () => {
      try {
        const [playlistData, likeData] = await Promise.all([getPlaylists(), getLikes()]);
        if (!active) return;
        setPlaylists(Array.isArray(playlistData) ? playlistData : []);
        setLikes(Array.isArray(likeData) ? likeData : []);
      } catch (err) {
        if (!active) return;
        setPlaylists([]);
        setLikes([]);
      } finally {
        if (!active) return;
        setLibraryLoading(false);
      }
    };

    loadLibrary();

    return () => {
      active = false;
    };
  }, [authenticated])

  useEffect(() => {
    let active = true;
    setHymnsLoading(true);
    const loadHymns = async () => {
      try {
        const data = await getHymns();
        if (!active) return;
        const items = Array.isArray(data) ? data : [];
        setBackendHymns(items);
        const mapped = items.map((hymn) => ({
          englishTitle: hymn.englishTitle || hymn.title || '',
          copticTitle: hymn.copticTitle || hymn.coptic_title || '',
          audioFileLink: hymn.audioFileLink || hymn.audio_url || '',
          season: hymn.season || 'Annual - Uncategorized',
          artist: hymn.artist || hymn.cantor || '',
        }));
        setCatalogHymns(mapped);
        const map = {};
        items.forEach((hymn) => {
          const audio = hymn.audioFileLink || hymn.audio_url;
          if (audio) {
            map[audio] = hymn.id;
            if (audio.startsWith('https://media.tasbeha.org')) {
              map[audio.replace('https://media.tasbeha.org', 'http://media.tasbeha.org')] = hymn.id;
            }
          }
        });
        setHymnIdMap(map);
      } catch (err) {
        if (!active) return;
        setBackendHymns([]);
        setCatalogHymns([]);
        setHymnIdMap({});
      } finally {
        if (!active) return;
        setHymnsLoading(false);
      }
    };
    loadHymns();
    return () => {
      active = false;
    };
  }, []);

  const handleAddToPlaylist = async (playlistId) => {
    if (!selectedHymn?.id) {
      setLibraryStatus('This hymn is not in the upload library yet.');
      setShowAddToPlaylist(false);
      return;
    }
    setActionLoading(true);
    try {
      await addPlaylistItem(playlistId, selectedHymn.id);
      setLibraryStatus('Added to playlist.');
    } catch (err) {
      setLibraryStatus(err.message || 'Failed to add to playlist.');
    } finally {
      setActionLoading(false);
    }
    setShowAddToPlaylist(false);
  };

  const LibraryItems = () => {
    const searchValue = librarySearch.trim().toLowerCase();
    const playlistItems = playlists.filter((p) =>
      p.title.toLowerCase().includes(searchValue)
    );
    const likeItems = likes.filter((l) =>
      l.hymn?.title?.toLowerCase().includes(searchValue)
    );

    const renderPlaylist = (item) => (
      <div className="libraryItem"
        key={`playlist-${item.id}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "calc(var(--padding) / 2) 0",
          gap: "var(--spacing)",
        }}>
        <img
          style={{
            width: "var(--iconSize)",
            height: "var(--iconSize",
            minWidth: "var(--iconSize)",
            minHeight: "var(--iconSize)",
            maxWidth: "var(--iconSize)",
            maxHeight: "var(--iconSize)",
            objectFit: "cover",
            background: "var(--primary)",
            borderRadius: "var(--border)",
          }}
          src={resolveMediaUrl(item.thumbnail)}
          alt="playlist thumbnail"
        />
        {(resize === 1) &&
          <span style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ color: "var(--secondary)", whiteSpace: "nowrap" }}>{item.title}</p>
            <p2 style={{ color: "var(--thirdly)" }}>{item.is_public ? 'Public' : 'Private'}</p2>
          </span>
        }
      </div>
    );

    const renderLike = (item) => (
      <div className="libraryItem"
        key={`like-${item.id}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "calc(var(--padding) / 2) 0",
          gap: "var(--spacing)",
        }}>
        <img
          style={{
            width: "var(--iconSize)",
            height: "var(--iconSize",
            minWidth: "var(--iconSize)",
            minHeight: "var(--iconSize)",
            maxWidth: "var(--iconSize)",
            maxHeight: "var(--iconSize)",
            objectFit: "cover",
            background: "var(--primary)",
            borderRadius: "var(--border)",
          }}
          src={""}
          alt="liked hymn"
        />
        {(resize === 1) &&
          <span style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ color: "var(--secondary)", whiteSpace: "nowrap" }}>{item.hymn?.title || 'Liked hymn'}</p>
            <p2 style={{ color: "var(--thirdly)" }}>Like</p2>
          </span>
        }
      </div>
    );

    return (
      <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
        {libraryTab === 'playlists' && playlistItems.map(renderPlaylist)}
        {libraryTab === 'likes' && likeItems.map(renderLike)}
      </div>
    )
  }

  const isHymnLiked = (hymnId) => {
    return likes.some((like) => like.hymn?.id === hymnId);
  };

  const digraphs = {
    ou: "ⲟⲩ",
    th: "ⲑ",
    sh: "ϣ",
    ch: "ϭ",
    ph: "ⲫ",
    ps: "ⲯ",
    kh: "ⲭ",
    gh: "ⲅ",
    ti: "ϯ"
  };

  const englishToCopticMap = {
    a: "ⲁ",
    b: "ⲃ",
    c: "ⲥ",
    d: "ⲇ",
    e: "ⲉ",
    f: "ⲫ",
    g: "ⲅ",
    h: "ϩ",
    i: "ⲓ",
    j: "ϫ",
    k: "ⲕ",
    l: "ⲗ",
    m: "ⲙ",
    n: "ⲛ",
    o: "ⲟ",
    p: "ⲡ",
    q: "ϧ",
    r: "ⲣ",
    s: "ⲥ",
    t: "ⲧ",
    u: "ⲩ",
    v: "ⲃ",
    w: "ⲱ",
    x: "ⲝ",
    y: "ⲓ",
    z: "ⲍ"
  };

  const copticToBohairicMap = {
    "ⲁ": "a",
    "ⲃ": "v",
    "ⲅ": "g",
    "ⲇ": "d",
    "ⲉ": "e",
    "ⲍ": "z",
    "ⲏ": "ee",
    "ⲑ": "th",
    "ⲓ": "i",
    "ⲕ": "k",
    "ⲗ": "l",
    "ⲙ": "m",
    "ⲛ": "n",
    "ⲝ": "ks",
    "ⲟ": "o",
    "ⲡ": "p",
    "ⲣ": "r",
    "ⲥ": "s",
    "ⲧ": "t",
    "ⲫ": "f",
    "ⲭ": "kh",
    "ⲯ": "ps",
    "ⲱ": "oo",
    "ϣ": "sh",
    "ϧ": "h",
    "ϫ": "j",
    "ϭ": "ch",
    "ϩ": "h"
  };

  const englishToCopticWord = (text) => {
    let result = "";
    const lower = text.toLowerCase();
    let i = 0;
    while (i < lower.length) {
      const two = lower.slice(i, i + 2);
      if (digraphs[two]) {
        result += digraphs[two];
        i += 2;
        continue;
      }
      const char = lower[i];
      if (englishToCopticMap[char]) {
        result += englishToCopticMap[char];
      } else {
        result += char;
      }
      i += 1;
    }
    return result;
  };

  const copticToBohairicWord = (text) => {
    let result = "";
    let i = 0;
    while (i < text.length) {
      if (text.slice(i, i + 2) === "ⲟⲩ") {
        result += "ou";
        i += 2;
        continue;
      }
      const char = text[i];
      if (copticToBohairicMap[char]) {
        result += copticToBohairicMap[char];
      } else {
        result += char;
      }
      i += 1;
    }
    return result;
  };

  const transliterateEnglishToBohairic = (text) => {
    const coptic = englishToCopticWord(text);
    return copticToBohairicWord(coptic);
  };

  const phraseOverrides = {
    "through the intercessions": "Hithen ni-presvia"
  };

  const computeTranslation = (value, from, to) => {
    const key = value.trim().toLowerCase();
    if (from === 'english' && to === 'coptic') {
      return englishToCopticWord(value);
    }
    if (from === 'english' && to === 'coptic-english') {
      if (phraseOverrides[key]) {
        return phraseOverrides[key];
      }
      return transliterateEnglishToBohairic(value);
    }
    if (from === 'coptic' && to === 'coptic-english') {
      return copticToBohairicWord(value);
    }
    if (to === 'english') {
      return value;
    }
    return value;
  };

  useEffect(() => {
    setTranslateOutput(computeTranslation(translateInput, leftLang, rightLang));
  }, [translateInput, leftLang, rightLang]);

  const toggleLike = async (hymnId) => {
    if (!authenticated) {
      setLibraryStatus('Please sign in to like hymns.');
      return;
    }
    if (!hymnId) {
      setLibraryStatus('This hymn is not in the upload library yet.');
      return;
    }
    setActionLoading(true);
    try {
      if (isHymnLiked(hymnId)) {
        await unlikeHymn(hymnId);
      } else {
        await likeHymn(hymnId);
      }
      const likeData = await getLikes();
      setLikes(Array.isArray(likeData) ? likeData : []);
    } catch (err) {
      setLibraryStatus(err.message || 'Failed to update like.');
    } finally {
      setActionLoading(false);
    }
  };

  const mainContainer = () => {

    const coverFlip = () => {
      setActionLoading(true);
      const bookCover = document.querySelector(".bookCover");

      if (bookCover) {
        bookCover.style.transform = "rotateY(-120deg)";

        const children = bookCover.childNodes;

        if (children) {
          children.forEach((c) => {
            c.style.opacity = 0;
          })
        }
      }

      const book = document.querySelector(".book");

      if (book) {
        book.style.pointerEvents = "none";
        book.style.zIndex = 4;
      }

      setArtistPage(0);
      setTimeout(() => setActionLoading(false), 800);
    }

    const pageFlip = () => {
      setActionLoading(true);
      const artistPage = document.querySelector(".lengthyTab");

      if (artistPage) {
        artistPage.style.transform = "rotateY(-120deg)";

        const children = artistPage.childNodes;

        if (children) {
          children.forEach((c) => {
            c.style.opacity = 0;
          })
        }
      }

      const book = document.querySelector(".artistSelections");

      if (book) {
        book.style.pointerEvents = "none";
        book.style.zIndex = 4;
      }

      setArtistPage(prev => (prev === 0 ? 1 : 0));
      setTimeout(() => setActionLoading(false), 800);
    }

    function formatText(text) {
      if (text.includes("Cantor")) {
        return text.replace("Cantor", "");
      }
    }

    const AudioPlayer = ({ title, artist, thumbnail, audioSrc }) => {
      const [isPlaying, setIsPlaying] = useState(false);
      const [wavesurfer, setWavesurfer] = useState(null);

      useEffect(() => {
        if (!wavesurfer) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        wavesurfer.on("play", handlePlay);
        wavesurfer.on("pause", handlePause);

        return () => {
          wavesurfer.un("play", handlePlay);
          wavesurfer.un("pause", handlePause);
        };
      }, [wavesurfer]);

      useEffect(() => {
        if (wavesurfer && audioSrc) {
          wavesurfer.load(audioSrc);
        }
      }, [audioSrc, wavesurfer]);

      const onReady = (ws) => {
        setWavesurfer(ws);
        setIsPlaying(false);
      };

      const previousSong = () => (
        <svg width="21" height="21" viewBox="0 0 21 21" onClick={() => wavesurfer?.setTime(0)}>
          <path d="M4.96665 10.5796L20.8 2.03033V19.1288L4.96665 10.5796Z" />
          <path d="M0.799988 0.707764H4.96665V20.7078H0.799988V0.707764Z" />
        </svg>
      );

      const playButton = () => (
        <svg width="50" height="50" viewBox="0 0 51 51">
          <path fillRule="evenodd" clipRule="evenodd" d="M25.3223 50.6159C39.2399 50.6159 50.5223 39.3335 50.5223 25.4159C50.5223 11.4984 39.2399 0.215942 25.3223 0.215942C11.4048 0.215942 0.122345 11.4984 0.122345 25.4159C0.122345 39.3335 11.4048 50.6159 25.3223 50.6159ZM15.4223 42.0034L45.1223 25.1159L15.4223 8.22845V42.0034Z" fill="var(--primary)" />
        </svg>
      );

      const pauseButton = () => (
        <svg width="50" height="50" viewBox="0 0 65 65">
          <path fillRule="evenodd" clipRule="evenodd" d="M32.6913 65.0001C50.4939 65.0001 64.9257 50.5683 64.9257 32.7657C64.9257 14.9632 50.4939 0.531433 32.6913 0.531433C14.8888 0.531433 0.457031 14.9632 0.457031 32.7657C0.457031 50.5683 14.8888 65.0001 32.6913 65.0001ZM22.6092 15.0596H28.8572V50.1692H22.6092V15.0596ZM36.5253 15.0596H42.7733V50.1692H36.5253V15.0596Z" fill="var(--primary)" />
        </svg>
      );

      const playPause = () => {
        if (!wavesurfer) return;

        wavesurfer.playPause();
        setIsPlaying((prev) => !prev);
      };

      return (
        <div style={{ width: "100%", zIndex: 2, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "var(--padding)" }}>

          <span style={{ position: "relative", display: "flex", gap: "var(--padding)", alignItems: "center" }}>

            <span onClick={playPause} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--padding)" }}>
              {isPlaying ? playButton() : pauseButton()}
            </span>

            <span>
              <h1 style={{ color: "var(--primary)" }}>{title}</h1>
              <p style={{ color: "var(--primary)" }}>{artist}</p>
            </span>
          </span>

          <span style={{ position: "relative", width: "100%", display: "flex", flexGrow: 1, gap: "var(--padding)", alignItems: "center" }}>
            <img style={{ flexBasis: "25%", flexGrow: 1, width: "25%", objectFit: "cover", borderRadius: "var(--border)" }} src={thumbnail} alt="thumbnail" />

            <span style={{ flexBasis: "80%", flexGrow: 1, width: "80%" }}>
              {audioSrc && (
                <WavesurferPlayer
                  barWidth={4}
                  barHeight={2}
                  barRadius={50}
                  waveColor="#1d3243"
                  progressColor="#e1ecf3"
                  url={audioSrc}
                  key={audioSrc}
                  backend="MediaElement"
                  crossOrigin="anonymous"
                  onReady={onReady}
                />
              )}
            </span>
          </span>
        </div>
      );
    };

    const artistsPerPage = 4;
    const currentStartIndex = artistPage * artistsPerPage;
    const currentEndIndex = currentStartIndex + artistsPerPage;
    const currentArtistHymnsLength = hymnsWithArtists.filter((hymn) =>
      hymn.season.includes(feastOnlyArray[selectedFeast])
    );

    function displayCount() {
      return (
        <div style={{
          display: "flex",
          alignItems: "center",
          background: "var(--primary)",
          borderRadius: selectedHymn && displayHymnAudio ? 0 : "var(--border) var(--border) 0 0",
          padding: "var(--padding)",
          overflow: "hidden"
        }}>
          <span style={{ display: "inline-flex", alignItems: "center", flexGrow: selectedHymn && displayHymnAudio ? 1 : 0 }}>
            <h1 style={{ textAlign: "center", marginRight: "0.25rem" }}>{currentArtistHymnsLength.length}</h1>
            <p style={{ textAlign: "center", textTransform: "uppercase", color: "var(--fourthy)" }}>tracks</p>
          </span>

          <span className="songOptions" style={{ overflow: "hidden", transition: "all 0.5s ease-in-out", flexGrow: selectedHymn && displayHymnAudio ? 0 : 1, opacity: selectedHymn && displayHymnAudio ? 1 : 0, display: "flex", height: "100%", zIndex: 2, alignItems: "center", justifyContent: "space-between" }}>
            <li>
              <button
                onClick={() => toggleLike(selectedHymn?.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  color: selectedHymn?.id && isHymnLiked(selectedHymn.id) ? '#e53935' : 'var(--fourthy)',
                }}
              >
                <svg width={20} height={20} viewBox="0 0 24 24" fill={selectedHymn?.id && isHymnLiked(selectedHymn.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </li>
            <li><img src={repost}></img></li>
            <li><img src={share}></img></li>
            <li><img src={copyLink}></img></li>
            <li>
              <img
                src={addToQueue}
                onClick={() => {
                  if (!authenticated) {
                    setLibraryStatus('Please sign in to add to playlists.');
                    return;
                  }
                  setShowAddToPlaylist(true);
                }}
              />
            </li>
          </span>
        </div>
      )
    }

    return (
      <div style={{ overflow: "hidden", paddingTop: height }}>
        
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "var(--sectionSpacing)",
          justifyContent: "center",
          alignItems: "start",
          padding: "var(--paddingSides)",
          width: "var(--pageWidth)",
          transition: "all 0.5s ease-in-out",
        }}>
          <div className="patternBackground"></div>
          <LoadingOverlay show={actionLoading} />

          <CarouselComponent />

          <div className="interfaceMain"
            style={{
              display: "flex",
              position: "relative",
              width: "100%",
              height: "100vh",
              overflow: "visible",
            }}>
            <div className="interfaceLeft" style={{
              display: "flex",
              flexDirection: "column",
              background: "var(--fourthy)",
              borderRadius: "var(--border)",
              position: "relative",
              overflow: "hidden",
              width: "min-content",
            }}>

              <span style={{ display: "flex", flexDirection: "column", boxShadow: "0px 5px 10px #426077a3", padding: "var(--spacing) var(--padding)", position: "relative", gap: "var(--padding)" }}>

                <span style={{ display: "flex", justifyContent: (resize === 1) ? "space-between" : "center", alignItems: "center"}}>
                  {(resize === 1) && <t2 style = {{ background: ""}}>Your Library</t2>}

                  <span style={{ background: "#96adb9", borderRadius: "100%", display: "flex", justifyContent: "center", alignItems: "center", width: "calc(var(--iconSize))", height: "var(--iconSize)", padding: (resize === 1) ?  0 : "calc(var(--spacing)) calc(var(--spacing))"}}>
                    <h2
                      style={{ fontSize: "calc(var(--sectionSpacing) * 1.5)",fontWeight: "100", color: "var(--fourthy)", textAlign: "center", cursor: "pointer" }}
                      onClick={() => navigate("/Profile?tab=playlists&create=1")}
                    >
                      +
                    </h2>
                  </span>
                </span>

                {(resize === 1) && 
                <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                  <div
                    style={{ flexGrow: 1 }}
                    className={libraryTab === 'playlists' ? "primaryButton" : "thirdlyButton"}
                    onClick={() => setLibraryTab('playlists')}
                  >
                    Playlists
                  </div>
                  <div
                    style={{ flexGrow: 1 }}
                    className={libraryTab === 'likes' ? "primaryButton" : "thirdlyButton"}
                    onClick={() => setLibraryTab('likes')}
                  >
                    Likes
                  </div>
                </div>}

              </span>

                <span style={{ display: "flex", flexDirection: "column", padding: "calc(var(--padding) / 2)", position: "relative", gap: "var(--padding)" }}>
                  {(resize === 1) &&
                <span style={{ display: "flex", alignItems: "center", gap: "var(--spacing)" }}>
                  <img src={searchIcon} alt="search icon" style={{ width: "calc(var(--iconSize) / 2)", height: "calc(var(--iconSize) / 2)" }} />
                  <input
                    className="librarySearcBar"
                    type="text"
                    placeholder="Search library..."
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    style={{ fontSize: "0.75rem", border: "none", background: "var(--fifthly)", width: "100%" }}
                  />
                </span>}
                {libraryStatus && (
                  <p style={{ color: "var(--thirdly)", margin: 0 }}>{libraryStatus}</p>
                )}
                <div style={{ position: "relative" }}>
                  {LibraryItems()}
                  <LoadingOverlay show={libraryLoading} />
                </div>
              </span>

            </div>

            <div className="interfaceCenter" style={{
              flexBasis: "50%",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              background: "var(--fourthy)",
              borderRadius: "var(--border)",
              padding: "var(--padding)",
              boxShadow: "var(--shadow, 0 2px 16px 0 rgba(0,0,0,0.08))"
            }}>
              
              <t2 style={{ textTransform: "uppercase" }}>Coptic Translate</t2>

              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

                <div style={{ display: "flex", alignItems: "center", gap: "var(--padding)"}}>
                  
                  <div style={{ display: "flex" }}>
                    <button
                      className={`fourthlyButton ${leftLang === 'english' ? 'clicked' : ''}`}
                      onClick={() => {
                        setLeftLang('english');
                        setTranslateOutput(computeTranslation(translateInput, 'english', rightLang));
                      }}
                    >
                      English
                    </button>
                    <button
                      className={`fourthlyButton ${leftLang === 'coptic' ? 'clicked' : ''}`}
                      onClick={() => {
                        setLeftLang('coptic');
                        setTranslateOutput(computeTranslation(translateInput, 'coptic', rightLang));
                      }}
                    >
                      Coptic
                    </button>
                  </div>
                </div>

                
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center"}}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "var(--padding)" }}>
                  
                  <div style={{ display: "flex" }}>
                    <button
                      className={`fourthlyButton ${rightLang === 'english' ? 'clicked' : ''}`}
                      onClick={() => {
                        setRightLang('english');
                        setTranslateOutput(computeTranslation(translateInput, leftLang, 'english'));
                      }}
                    >
                      English
                    </button>
                    <button
                      className={`fourthlyButton ${rightLang === 'coptic' ? 'clicked' : ''}`}
                      onClick={() => {
                        setRightLang('coptic');
                        setTranslateOutput(computeTranslation(translateInput, leftLang, 'coptic'));
                      }}
                    >
                      Coptic
                    </button>
                    <button
                      className={`fourthlyButton ${rightLang === 'coptic-english' ? 'clicked' : ''}`}
                      onClick={() => {
                        setRightLang('coptic-english');
                        setTranslateOutput(computeTranslation(translateInput, leftLang, 'coptic-english'));
                      }}
                    >
                      Coptic (English)
                    </button>
                  </div>
                </div>

              </div>

              <div style={{ display: "flex", flexDirection: "row", width: "100%", gap: "var(--padding)", height: "100%", position: "relative" }}>

                
                <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--primary-bg, #fff)", borderRadius: "var(--border)", boxShadow: "var(--shadow, 0 2px 8px 0 rgba(0,0,0,0.04))" }}>
                  <textarea
                    placeholder="Enter text"
                    value={translateInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTranslateInput(value);
                      setTranslateOutput(computeTranslation(value, leftLang, rightLang));
                    }}
                    style={{ width: "100%", height: "100%", border: "none", outline: "none", resize: "vertical", fontSize: "1rem", background: "transparent", color: "var(--primary)", fontFamily: "inherit", margin: "var(--padding)", color: "var(--secondary)" }}
                  />
                </div>

                
                <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--primary-bg, #fff)", borderRadius: "var(--border)", boxShadow: "var(--shadow, 0 2px 8px 0 rgba(0,0,0,0.04))" }}>
                  <textarea
                    placeholder="Translation"
                    value={translateOutput}
                    readOnly
                    style={{ width: "100%", height: "100%", border: "none", outline: "none", resize: "vertical", fontSize: "1rem", background: "transparent", color: "var(--primary)", fontFamily: "inherit", margin: "var(--padding)", color: "var(--secondary)" }}
                  />
                </div>

              </div>
            </div>
          </div>

          
          <div
            className="cantorBookContainer"
            style={{
              display: "flex",
              position: "relative",
              width: "100%",
              overflow: "visible",
              height: "100vh",
            }}
          >
            
            <span
              style={{
                position: "relative",
                flexBasis: selectedFeast ? "30%" : "100%",
                flexGrow: selectedFeast ? 0.5 : 1,
                flexShrink: 0,
                transition: "all 0.8s ease-in-out",
                overflow: "visible",
                width: "30%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
                <span style={{ width: "100%", position: "relative", overflow: "visible", display: "flex", justifyContent: "center", alignContent: "center", zIndex: 10, height: "80vh" }}>

                  <img src={standEdge} style={{ position: "absolute", left: "50%", bottom: 0, zIndex: 5, transformStyle: "preserve-3d", transform: "rotateX(5deg) translateX(-50%)", width: "100%", pointerEvents: "none" }} />

                  <div style={{ position: "absolute", perspective: "150px", perspectiveOrigin: "center center", width: "100%", height: "100%" }}>
                    <img src={deaconStand} style={{ zIndex: 3, overflow: "visible", position: "absolute", left: "50%", transform: "translateX(-50%) rotateX(3deg)", width: "90%", height: "100%", objectFit: "fill", transformOrigin: "center bottom", transformStyle: "preserve-3d" }} />
                  </div>

                  <span style={{ position: "relative", width: "100vw" }}>

                    <div className="book" style={{ zIndex: 4, perspective: "150px", perspectiveOrigin: "center bottom", width: "100%", height: "100%", transform: "translateY(-20px)", position: "absolute", left: 0, top: 0 }}>
                      <span style={{ 
                        width: '80%',
                        position: "absolute", 
                        left: "50%", 
                        top: 0, 
                        height: "100%", 
                        transformOrigin: "center bottom", 
                        overflow: "visible", 
                        transform: "rotateX(3deg) translateX(-50%)", 
                        transformStyle: "preserve-3d",
                        }}>

                        <div className="bookCover" onClick={() => coverFlip()} style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "absolute", left: 0, top: 0, width: "100%", background: "var(--primary)", filter: "drop-shadow(0px 5px 0px #162836)", height: "100%", transformOrigin: "0% 50%", transition: "all 1s ease-in-out" }}>
                          <img src={coverBorder} alt="cover border" />
                          <t2 style={{ position: "relative", fontSize: "3rem", color: "var(--secondary)"}}>Our Cantors</t2>
                        </div>
                      </span>
                    </div>

                    <div className="artistSelections" style={{ perspective: "150px", perspectiveOrigin: "center bottom", width: "100%", height: "100%", zIndex: 3, transform: "translateY(-20px)", position: "absolute", left: 0, top: 0}}>

                      <span style={{ position: "absolute", left: "50%", top: 0, height: "100%", width: "80%", transformOrigin: "center bottom", overflow: "visible", transform: "rotateX(3deg) translateX(-50%)", transformStyle: "preserve-3d"}}>

                        <div className="lengthyTab" style={{ display: "flex", alignItems: "start", flexDirection: "column", position: "relative", background: "var(--fourthy)", filter: "drop-shadow(0px 5px 0px #162836)", height: "100%", transformOrigin: "0% 50%", transition: "all 1s ease-in-out", overflow: "hidden", padding: "0 var(--padding)" }}>

                          <div className="hymnSearchNav" style={{ listStyle: "none", width: "100%", position: "relative", overflow: "visible" }}>
                            <div style={{ top: 0, gap: "var(--padding)", display: "inline-flex" }} className="markers">
                              {["Cantor", "Season", "Feast", "Hymn"].map((label, idx) => (
                                <li
                                  key={label}
                                  style={{ transform: "translateY(-100%)", cursor: "pointer" }}
                                  onClick={() => handleNavMarkerClick(idx)}
                                >
                                  <img src={SectionMarker} />
                                  <p>{label}</p>
                                </li>
                              ))}
                            </div>
                          </div>

                          <div style={{ position: "relative", display: 'flex', alignItems: "center", justifyContent: "space-between", gap: "var(--spacing)", overflow: "visible", width: "100%" }}>
                            {(selectedArtist === null) &&
                              <span style={{ width: "var(--iconSize)", height: "var(--iconSize)", position: "relative", margin: 0}} onClick={() => pageFlip()}>
                                <CrossButton fill="var(--primary)" />
                              </span>
                            }

                            <span
                              className="artistContainer"
                              style={{
                                display: "flex",
                                flexDirection: (resize === 2) ? "column" : "row",
                                justifyContent: "flex-start",
                                alignItems: "stretch",
                                gap: "var(--padding)",
                                width: "100%",
                                flexGrow: 1
                              }}
                            >
                              
                              {artistPage > 0 && (
                                <button
                                  style={{ marginRight: "1rem", cursor: "pointer", background: "var(--primary)", border: "none", borderRadius: "50%", width: "2rem", height: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                                  onClick={handlePrevArtists}
                                  aria-label="Previous artists"
                                >
                                  <svg width="24" height="24" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="var(--fifthly)" strokeWidth="2" fill="none" /></svg>
                                </button>
                              )}

                              {artistOnlyArray.slice(currentStartIndex, currentEndIndex).map((hymn, index) => {
                                const globalIndex = currentStartIndex + index;
                                if (selectedArtist !== null && selectedArtist !== globalIndex) return null;

                                let name = formatText(hymn.artist);

                                const artistToSeason = () => {
                                  setSelectedArtist(globalIndex);
                                  setSeasonLoad(false);
                                  setFeastLoad(false);
                                  setLoading(true);
                                  setTimeout(() => {
                                    setSeasonLoad(true);
                                  }, 1000);
                                };

                                return (
                                  <div
                                    className="artistTab"
                                    key={globalIndex}
                                    onClick={() => artistToSeason()}
                                    style={{
                                      transition: "all 0.5s ease-in-out",
                                      margin: 0,
                                      width: (selectedArtist !== null || resize === 2) ? "100%" : "auto",
                                      flex: (selectedArtist !== null || resize === 2) ? "1 1 100%" : "1 1 0",
                                      minWidth: 0
                                    }}
                                  >
                                    <span style={{ position: 'relative', gap: "var(--padding)", flexDirection: (selectedArtist === globalIndex) ? "row" : "column", width: "100%", borderRadius: "var(--border) 0 0 var(--border)", alignItems: (selectedArtist === globalIndex) ? "center" : "center", justifyContent: "center", minHeight: "100%" }}>
                                      <img className="profilePic" src={hymn.imgLink} style={{ border: 'solid var(--fourthly)', borderWidth: '0 10px 5px 0', height: "var(--profile)", width: "var(--profile)", marginBottom: "var(--padding)" }} alt="hymnImgLink" />

                                      <li style={{ listStyle: "none", marginLeft: 'var(--padding)', marginRight: 'var(--padding)', marginBottom: (selectedArtist === globalIndex) ? 0 : "var(--border)", textAlign: "center" }}>
                                        <ArtistIcon fill="var(--fourthy)" caption="cantor" textColor="var(--fourthy)" />
                                        <h1 style={{ whiteSpace: (selectedArtist === globalIndex) ? "nowrap" : 'wrap' }}>{name}</h1>
                                      </li>
                                    </span>

                                    <img className="robeImg" src={Robe} alt="robeImg" />
                                  </div>
                                );
                              })}

                              
                              {artistPage < totalPages - 1 && (
                                <button
                                  style={{ marginLeft: "1rem", cursor: "pointer", background: "var(--primary)", border: "none", borderRadius: "50%", width: "2rem", height: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                                  onClick={handleNextArtists}
                                  aria-label="Next artists"
                                >
                                  <svg width="24" height="24" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="var(--fifthly)" strokeWidth="2" fill="none" /></svg>
                                </button>
                              )}
                            </span>

                            {(selectedArtist === null) &&
                              <span style={{ width: "var(--iconSize)", height: "var(--iconSize)", position: "relative", margin: 0}} onClick={() => pageFlip()}>
                                <CrossButton fill="var(--primary)" />
                              </span>
                            }
                          </div>

                          {displayArtistSeasons && seasonsOfArtist()}
                          {displayArtistFeasts && feastsOfSeasons()}

                        </div>

                      </span>

                    </div>
                  </span>
                </span>

                <img src={Stool} style={{ position: "relative", width: "90%" }} />
              </div>
            </span>

            {selectedFeast &&
              <span
                style={{
                  position: "relative",
                  flexBasis: selectedFeast ? "50%" : "0%",
                  flexGrow: selectedFeast ? 0.5 : 0,
                  opacity: selectedFeast ? 1 : 0,
                  transition: "all 0.8s ease-in-out",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  width: "70%",
                  height: "90%",
                  borderRadius: "0 0 var(--border) var(--border)",
                }}
              >
                
                <>
                  {displayArtistHymns && selectedFeast !== null && (
                    <>
                      <span
                        style={{
                          position: "relative",
                          overflow: "visible",
                          transition: "all 0.8s ease-in-out",
                          height: selectedHymn && displayHymnAudio ? "100%" : "0px",
                          opacity: selectedHymn && displayHymnAudio ? 1 : 0,
                          display: "flex",
                          flexDirection: "column",
                          padding: "var(--padding) var(--padding) 0 var(--padding)",
                        }}
                      >

                        <div className="hymnBackgroundWrapper">
                          {hymnsWithArtists
                            .filter((hymn) => selectedHymn?.audioFileLink === hymn.audioFileLink)
                            .map((hymn, i) => (
                              <>
                                <img
                                  key={i}
                                  src={hymn.imgLink}
                                  alt="Hymn background"
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    zIndex: 0,
                                    transition: "filter 0.5s ease-in-out",
                                  }}
                                />
                              </>
                            ))}
                        </div>

                        {(selectedHymn && displayHymnAudio) &&
                          <AudioPlayer
                            key={selectedHymn?.audioFileLink}
                            title={selectedHymn?.englishTitle}
                            artist={selectedHymn?.artist}
                            thumbnail={selectedHymn?.imgLink}
                            audioSrc={proxyAudioUrl(selectedHymn?.audioFileLink)}
                          />
                        }
                      </span>

                      {displayCount()}
                      <div className="hymnResults" style={{
                        position: "relative",
                        zIndex: 1,
                        overflowY: "scroll",
                        height: "100%",
                        background: "var(--fifthly)",
                      }}>
                        <LoadingOverlay show={hymnsLoading} />
                        {currentArtistHymnsLength.map((hymn, index) => {
                          function hymnClick() {
                            const backendId = hymnIdMap[hymn.audioFileLink];
                            setSelectedHymn({ ...hymn, id: backendId || null });
                            setDisplayHymnAudio(true);
                          }

                          function hymnHover(e) {
                            e.currentTarget.style.background = "var(--secondary)";
                            e.currentTarget.style.transition = "0.25s ease-in-out";
                            e.currentTarget
                              .querySelectorAll("h1, p")
                              .forEach((el) => (el.style.color = "var(--fifthly)"));
                          }

                          function undoHover(e) {
                            e.currentTarget.style.background = "var(--fifthly)";
                            e.currentTarget
                              .querySelectorAll("h1")
                              .forEach((el) => (el.style.color = "var(--primary)"));
                            e.currentTarget
                              .querySelectorAll("p")
                              .forEach((el) => (el.style.color = "var(--fourthy)"));
                          }

                          return (
                            <div
                              key={hymn.audioFileLink ?? index}
                              className="hymnRecording"
                              onMouseOver={hymnHover}
                              onMouseLeave={undoHover}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--spacing)",
                                cursor: "pointer",
                                zIndex: 1,
                                boxShadow: "inset 5px 5px 10px rgba(0, 0, 0, 0.5)",
                                padding: "var(--padding)",
                                background: "none",
                              }}
                            >
                              <img src={hymn.imgLink} style={{ width: "1rem", marginRight: "0.5rem" }} />
                              
                              <p style={{ color: "var(--fourthy)" }}>{index + 1}</p>
                              <p>•</p>
                              <p style={{ color: "var(--thirdly)" }} onClick={hymnClick}>{hymn.artist}</p>
                              <p>•</p>
                              <h1 style={{ color: "var(--primary)", flex: 1 }} onClick={hymnClick}>{hymn.englishTitle}</h1>

                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLikeToggle(hymn.audioFileLink);
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '0.5rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  transition: 'transform 0.2s',
                                  color: isHymnLiked(hymnIdMap[hymn.audioFileLink]) ? '#e53935' : 'inherit'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                              >
                                <svg width={20} height={20} viewBox="0 0 24 24" fill={isHymnLiked(hymnIdMap[hymn.audioFileLink]) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
                                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                              </button>

                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(hymn.audioFileLink, hymn.englishTitle);
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '0.5rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                              >
                                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                  <polyline points="7 10 12 15 17 10"></polyline>
                                  <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                              </button>
                            </div>
                          );
                        })}
                      </div>

                    </>
                  )}
                </>
              </span>

            }
          </div>

        </div >
      </div>
    )
  }

  return (
    <>
      {mainContainer()}
      {showAddToPlaylist && (
        <div className="popupOverlay" onClick={() => setShowAddToPlaylist(false)}>
          <div className="popupContent" onClick={(e) => e.stopPropagation()}>
            <h2>Add To Playlist</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {playlists.map((playlist) => (
                <button
                  key={`add-${playlist.id}`}
                  className="thirdlyButton"
                  onClick={() => handleAddToPlaylist(playlist.id)}
                >
                  {playlist.title}
                </button>
              ))}
              {playlists.length === 0 && (
                <p style={{ color: "var(--thirdly)" }}>No playlists yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
