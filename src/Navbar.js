import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import logo from "./img/logoV2.svg";
import outlineLogo from "./img/outlinelogoV2.svg";
import followingIcon from "./img/followingIcon.svg";
import heart from "./img/lightHeart.svg";
import profileIcon from "./img/profileIcon.svg";
import downCaret from "./img/downCaret.svg";
import "./Navbar.css";
import "./App.css";
import { SearchBarComp } from "./Home.js";
import { Login, Signup } from "./Login.js";
import { AuthContext } from "./AuthContext.js";
import { logout, resolveMediaUrl } from "./api.js";

export const Navbar = () => {
    const [resize, setResize] = useState(() => {
        if (typeof window !== "undefined") {
            if (window.innerWidth <= 1440 && window.innerWidth >= 1000) return 1;
            if (window.innerWidth <= 1000 && window.innerWidth >= 465) return 2;
        }
        return 1;
    });
    const [expandBurger, setExpandBurger] = useState(false);
    const [scroll, setScroll] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);
    const { authenticated, user, refresh } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleResize = useCallback(() => {
        const width = window.innerWidth;
        if (width <= 1440 && width >= 1000) setResize(1);
        else if (width <= 1000 && width >= 465) setResize(2);
        else setResize(1);
    }, []);

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [handleResize]);

    useEffect(() => {
        const handleScroll = () => setScroll(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const activateLoad = (pageNum) => {
        setTimeout(() => {
            const routes = [
                "/",
                "/Profile",
                "/Upload",
            ];
            navigate(routes[pageNum] || "/");
        }, 2000);
    };

    useEffect(() => {
        const menu = document.querySelector(".menuContainer");
        const nav = document.querySelector(".navContainer");
        const socialLinks = document.querySelector(".socialLinks");

        if (!menu || !nav) return;

        if (resize === 1) {
            menu.classList.remove("mobile", "expanded");
            menu.classList.add("fullScreen");
            nav.classList.remove("hiddenNav");
        }

        if (resize === 2) {
            menu.classList.remove("fullScreen");
            menu.classList.add("mobile");

            if (expandBurger) {
                menu.classList.add("expanded");
                socialLinks?.classList.add("linksExpand");
                nav.classList.remove("hiddenNav");
            } else {
                menu.classList.remove("expanded");
                socialLinks?.classList.remove("linksExpand");
                nav.classList.add("hiddenNav");
            }
        }
    }, [resize, expandBurger]);

    const handlePopupClose = () => {
        setShowPopup(false);
        setShowSignUp(false);
    };

    const handleSignUpPopUp = () => {
        setShowPopup(false);
        setShowSignUp(true);
    };

    const handleLogoClick = () => {
        if (resize === 2) {
            setExpandBurger((prev) => !prev);
        } else {
            navigate("/");
        }
    };

    const handleUploadClick = () => {
        if (authenticated) {
            activateLoad(2);
        } else {
            setShowSignUp(true);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            // ignore for now
        }
        refresh();
        setProfileDropdown(false);
    };

    return (
        <>
            <div
                className={`menuContainer ${resize === 2
                    ? expandBurger
                        ? "mobile expanded"
                        : "mobile"
                    : "fullScreen"
                    }`}

                style={{
                    width: "var(--pageWidth)",
                    padding: "var(--paddingSides)"
                }}
            >

                <span onClick={handleLogoClick} style={{ cursor: resize === 2 ? "pointer" : "default" }}>
                    <img
                        src={logo}
                        alt="logo"
                        style={{ width: "100px", height: "100px" }}
                    />
                </span>

                <nav className={`navContainer ${scroll ? "scroll" : ""}`}>
                    <span>
                        <SearchBarComp
                            barWidth="100%"
                            searchBarBackground="var(--fifthly)"
                            borderRadius="1rem"
                            searchIconFill="white"
                            textColor="white"
                            borderColor="white"
                        />

                    </span>

                    <span className="userDropdown"
                        style={{
                            position: "relative",
                            gap: "var(--sectionSpacing)",
                            display: "flex",
                            alignItems: "center",
                        }}>

                        <div onClick={() => setProfileDropdown((prev) => !prev)} style={{ padding: 0, margin: 0, display: "flex", alignItems: "center", justifyContent: "flex-start", width: "100%", gap: "var(--padding)" }}>
                            <img src={resolveMediaUrl(user?.profile?.avatar) || profileIcon} alt="profile" className="profileIcon"
                                style={{
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    width: "calc(var(--profile) / 2)",
                                    height: "calc(var(--profile) / 2)",
                                    background: "var(--primary)",
                                }}
                            />

                            <img src={downCaret} className="downCaret" style={{ filter: "brightness(1.5)"}} />
                        </div>

                        {profileDropdown && authenticated && (
                            <div
                                className="profileDropdown">
                                <li onClick = {() =>  navigate("/Profile")}>
                                    <img src={profileIcon} />
                                    <p>Profile</p>
                                </li>

                                <li>
                                    <img src={heart} />
                                    <p>Likes</p>
                                </li>

                                <li>
                                    <img src={followingIcon} />
                                    <p>Following</p>
                                </li>

                                <li onClick={handleLogout}>
                                    <img src={profileIcon} />
                                    <p>Logout</p>
                                </li>
                            </div>
                        )}
                    </span>

                    <div
                        className="secondaryButton"
                        onClick={() => setShowPopup(true)}
                    >
                        {authenticated ? (user?.username || 'Account') : 'Sign In'}
                    </div>

                    <div
                        onClick={handleUploadClick}
                        className="primaryButton">
                        Upload
                    </div>
                </nav>
            </div>

            {showSignUp && (
                <Signup onClose={handlePopupClose} onAuthSuccess={refresh} />
            )}

            {showPopup && (
                <div className="popupOverlay" onClick={handlePopupClose}>
                    <div className="popupContent" onClick={(e) => e.stopPropagation()}>
                        <Login onClose={handlePopupClose} displaySignUp={handleSignUpPopUp} onAuthSuccess={refresh} />
                    </div>
                </div>
            )}
        </>
    );
};

export default function init() {
    return (
        <Navbar showSearch="" />
    )
}
