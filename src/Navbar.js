import "./style.css";
import logo from './img/logo.svg';
import aboutIcon from './img/aboutIcon.svg';
import contactIcon from './img/contactIcon.svg';

function Navbar() {
    return (
        <nav>
            <li><img src={logo} alt="logo" /></li>
            <li>
                <img src={aboutIcon} alt="aboutIcon" />
                <a href="about.html"><h2>About</h2></a>
            </li>
            <li>
                <img src={contactIcon} alt="contactIcon" />
                <a href="contact.html"><h2>Contact</h2></a>
            </li>
        </nav >
    )
}
export default Navbar;