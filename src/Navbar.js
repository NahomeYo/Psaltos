import "./style.css";
import logo from './img/logo.svg';
import aboutIcon from './img/aboutIcon.svg';
import contactIcon from './img/contactIcon.svg';

function Navbar({ selectedArtist }) {
    const liStyle = {
        background: selectedArtist ? 'var(--primary-color)' : 'none',
        width: selectedArtist ? '100%' : 'min-content',
        borderRadius: selectedArtist ? 'var(--max)' : 'none',
        overflow: selectedArtist ? 'hidden' : 'visible',
        maxHeight: selectedArtist ? 'var(--mini)' : 'auto',
    };
    
    return (
        <nav style={{ flexDirection: selectedArtist ? 'column' : 'row', alignItems: selectedArtist ? 'start' : 'center', gap: selectedArtist ? 'var(--mini)' : 'var(--max)', transition: '1s var(--smoothAnim)', }}>
            <li style={liStyle}>
                <img style={{ width: selectedArtist ? 'var(--big)' : 'var(--max)', opacity: selectedArtist ? '0' : '1', }}
                    src={logo} alt="logo" /></li>
            <li style={liStyle}>
                <img style={{ opacity: selectedArtist ? '0' : '1', }} src={aboutIcon} alt="aboutIcon" />
                <a href="about.html"><h2>About</h2></a>
            </li>
            <li style={liStyle}>
                <img style={{ opacity: selectedArtist ? '0' : '1', }} src={contactIcon} alt="contactIcon" />
                <a href="contact.html"><h2>Contact</h2></a>
            </li>
        </nav >
    )
}
export default Navbar;