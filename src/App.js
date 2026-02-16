import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Upload } from "./Upload.js";
import { Home } from "./Home.js";
import { Profile } from "./Profile.js";
import { Footer } from "./Footer.js";
import { Navbar } from "./Navbar.js";
import { LoadingScreen } from "./LoadingScreen";
import './App.css';
import "./animation.css";
import "./media.css";
import { AuthContext } from './AuthContext.js';
import { me } from './api.js';

function App() {
  const [navHeight, setNavHeight] = useState('0px');
  const [loading, setLoading] = useState(false);
  const [authState, setAuthState] = useState({ authenticated: false, user: null });

  const refreshAuth = useCallback(async () => {
    try {
      const data = await me();
      if (data.authenticated) {
        setAuthState({ authenticated: true, user: data.user });
      } else {
        setAuthState({ authenticated: false, user: null });
      }
    } catch (err) {
      setAuthState({ authenticated: false, user: null });
    }
  }, []);

  useEffect(() => {
    const nav = document.querySelector(".menuContainer");
    if (nav) {
      let calcHeight = nav.getBoundingClientRect().height + "px";
      setNavHeight(calcHeight);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  return (
    <>
      <LoadingScreen loading={loading} setLoading={setLoading} />
      <AuthContext.Provider value={{ ...authState, refresh: refreshAuth, setAuthState }}>
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
            <Route
              path="/Profile"
              element=
              {<Profile
                height={navHeight}
              />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
      <Footer />
    </>
  );
}

export default App;
