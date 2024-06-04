import "./style.css";
import logo from './img/logo.svg';

function Navbar() {
    <>
        <nav>
            <ul>
                <li><img className="menuLogo" src={logo} alt="logo" /></li>
                <li><a href="about.html"><h2>About</h2></a></li>
                <li><a href="contact.html"><h2>Contact</h2></a></li>
            </ul>
        </nav>
    </>
}
export default Navbar;