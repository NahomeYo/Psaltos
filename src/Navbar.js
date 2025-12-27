import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import logo from "./img/logoV2.svg";
import "./Navbar.css";
import "./App.css";
import downCaret from "./img/downCaret.svg";
import { SearchBarComp } from "./Home.js";

export const Navbar = ({ showSearch }) => {
    const [dropdown, setDropdown] = useState(null);
    const [resize, setResize] = useState(() => {
        if (typeof window !== "undefined") {
            if (window.innerWidth <= 1440 && window.innerWidth >= 1000) return 1;
            if (window.innerWidth <= 1000 && window.innerWidth >= 465) return 2;
        }
        return 1;
    });
    const [expandBurger, setExpandBurger] = useState(false);
    const [scroll, setScroll] = useState(false);

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
                "/LiveStream",
                "/Location",
                "/COC",
                "/PT",
                "/Saints",
                "/Ministries",
                "/Calendar",
                "/Gallery",
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

    const dropdownOptions = (index) => {
        const isActive = dropdown === index;
        const className = isActive ? "options" : "noOptions";

        const linkStyle = {
            background: "var(--secondary)",
            color: expandBurger && resize === 2 ? "var(--thirdly)" : "",
        };

        switch (index) {
            case 1:
                return (
                    <div className={className}>
                        <button
                            style={linkStyle}
                            onClick={() => activateLoad(1)}
                            className="dropdownLink"
                        >
                            <p>LiveStream</p>
                        </button>
                        <button
                            style={linkStyle}
                            onClick={() => activateLoad(2)}
                            className="dropdownLink"
                        >
                            <p>Location</p>
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div className={className}>
                        <button
                            style={linkStyle}
                            onClick={() => activateLoad(3)}
                            className="dropdownLink"
                        >
                            <p>The Coptic Orthodox Church</p>
                        </button>
                        <button
                            style={linkStyle}
                            onClick={() => activateLoad(4)}
                            className="dropdownLink"
                        >
                            <p>H.H Pope Tawadros II</p>
                        </button>
                        <button
                            style={linkStyle}
                            onClick={() => activateLoad(5)}
                            className="dropdownLink"
                        >
                            <p>Our Saints</p>
                        </button>
                    </div>
                );
            default:
                return null;
        }
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
                onClick={() => !expandBurger && resize === 2 && setExpandBurger(true)}
            >
                {resize === 2 && (
                    <button
                        className={`hamburgerMenu ${expandBurger ? "open" : ""}`}
                        onClick={() => setExpandBurger((prev) => !prev)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                )}

                <nav className={`navContainer ${scroll ? "scroll" : ""}`}>
                    <span>
                        <img
                            onClick={() => activateLoad(3)}
                            src={logo}
                            alt="logo"
                            style={{ width: "100px", height: "100px" }}
                        />
                    </span>

                    <span>
                        {showSearch && (
                            <SearchBarComp
                                barWidth="20rem"
                                searchBarBackground="white"
                                borderRadius="1rem"
                                searchIconFill="var(--primary)"
                                textColor="var(--primary)"
                                borderColor="none"
                            />
                        )}
                    </span>

                    <span>
                        <li onClick={() => activateLoad(1)} className="link">
                            <p>Feed</p>
                        </li>
                        <li onClick={() => activateLoad(2)} className="link">
                            <p>Library</p>
                        </li>
                        <li onClick={() => activateLoad(2)} className="link">
                            <primaryButton><p>Upload</p></primaryButton>
                        </li>

                        <div className="profilePic">
                            <img></img>
                            <img src={downCaret} />
                        </div>
                    </span>
                </nav>
            </div>
        </>
    );
};

export default function init() {
    return (
        <Navbar showSearch="" />
    )
}