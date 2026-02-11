import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Upload } from "./Upload.js";
import { Home } from "./Home.js";
import { Profile } from "./Profile.js";
import { Footer } from "./Footer.js";
import { Navbar } from "./Navbar.js";
import { LoadingScreen } from "./LoadingScreen";
import './App.css';
import "./animation.css";
import "./media.css";

function App() {
  const [navHeight, setNavHeight] = useState('0px');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const nav = document.querySelector(".menuContainer");
    if (nav) {
      let calcHeight = nav.getBoundingClientRect().height + "px";
      setNavHeight(calcHeight);
    }
  }, []);

  return (
    <>
      <LoadingScreen loading={loading} setLoading={setLoading} />
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                height={navHeight}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
          <Route
            path="/Upload"
            element=
            {<Upload
              height={navHeight}
            />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
