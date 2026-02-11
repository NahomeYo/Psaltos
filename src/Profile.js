import './App.css';
import "./animation.css";
import "./media.css";
import "./interfaceMain.css";
import { ArtistIcon } from './icons.js';
import { useState, useEffect, useContext, useRef } from "react";
import Robe from "./img/robe.svg";
import shareButton from "./img/share.svg";
import editButton from "./img/editIcon.svg";
import { AuthContext } from './AuthContext.js';
import { updateProfile, resolveMediaUrl } from './api.js';

export function Profile({ height }) {
    const { authenticated, user, refresh } = useContext(AuthContext);
    const userName = user?.profile?.display_name || user?.username || "User";
    const [showImagePopup, setShowImagePopup] = useState(false);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [status, setStatus] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!authenticated) {
            setStatus('Please sign in to view your profile.');
        } else {
            setStatus('');
        }
    }, [authenticated]);

    const handleImageClick = () => {
        setShowImagePopup(true);
    };

    const handleUpdateImage = async (action) => {
        if (action === "replace") {
            fileInputRef.current?.click();
        } else if (action === "delete") {
            setShowUpdatePopup(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            await updateProfile({ avatar: file });
            await refresh();
            setStatus('Profile photo updated.');
        } catch (err) {
            setStatus(err.message || 'Update failed.');
        }
        setShowUpdatePopup(false);
    };

    return (
        <div style={{ paddingTop: height, width: "var(--pageWidth)", margin: "var(--paddingSides)", minHeight: "100vh" }}>
            <div className="artistTab" style={{ width: "100%" }} >
                <span style={{ position: 'relative', gap: "var(--sectionSpacing)", flexDirection: "row", width: "100%", borderRadius: "var(--border) 0 0 var(--border)", alignItems: "center", padding: "var(--padding)" }}>
                    <img
                        className="profilePic"
                        style={{ height: "var(--profile)", width: "var(--profile)", borderRadius: "50%", background: "red", cursor: "pointer" }}
                        alt="profile"
                        src={resolveMediaUrl(user?.profile?.avatar)}
                        onClick={() => setShowUpdatePopup(true)}
                    />
                    <h1 style={{ whiteSpace: 'wrap' }}>{userName}</h1>
                </span>

                <img className="robeImg" src={Robe} style={{ height: "150%", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", background: "none" }} alt="robeImg" />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", padding: 0, justifyContent: "space-between", gap: "var(--sectionSpacing)", margin: "var(--sectionSpacing) 0" }}>
                <span className="interfaceLeft" style={{ flexBasis: "80%", flexGrow: 2, flexDirection: "row", display: "flex", justifyContent: "space-between", padding: "var(--padding)" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0, color: "var(--thirdly)" }}>1</h2>
                        <p style={{ fontSize: "0.9rem", color: "var(--thirdly)", margin: 0 }}>Followers</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <p style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0, color: "var(--thirdly)" }}>3</p>
                        <p style={{ fontSize: "0.9rem", color: "var(--thirdly)", margin: 0 }}>Following</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <p style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0, color: "var(--thirdly)" }}>0</p>
                        <p style={{ fontSize: "0.9rem", color: "var(--thirdly)", margin: 0 }}>Tracks</p>
                    </div>
                </span>

                <span style={{ flexBasis: "20%", flexGrow: 0, display: "flex", justifyContent: "space-between", height: "100%", alignItems: "center", flexGrow: 0, borderRadius: "var(--padding)", gap: "calc(var(--sectionSpacing) /2)" }}>
                    <div className="primaryButton">
                        <img src={shareButton} alt="Share" />
                        Share
                    </div>
                    <div className="secondaryButton">
                        <img src={editButton} alt="Edit" />
                        Edit
                    </div>
                </span>
            </div>

            <div style = {{ width: "100%", marginBottom: "var(--sectionSpacing)"}}>
                <div className="interfaceRight" style = {{ display: "flex", justifyContent: "start", alignItems: "center", margin: "var(--sectionSpacing) 0", width: "100%", overflow: "hidden"}}>
                        <button className="fourthlyButton" onClick={e => { const parent = e.currentTarget.parentNode; Array.from(parent.children).forEach(btn => btn.classList.remove('clicked')); e.currentTarget.classList.add('clicked'); }}>All</button>
                        <button className="fourthlyButton" onClick={e => { const parent = e.currentTarget.parentNode; Array.from(parent.children).forEach(btn => btn.classList.remove('clicked')); e.currentTarget.classList.add('clicked'); }}>Likes</button>
                        <button className="fourthlyButton" onClick={e => { const parent = e.currentTarget.parentNode; Array.from(parent.children).forEach(btn => btn.classList.remove('clicked')); e.currentTarget.classList.add('clicked'); }}>Playlists</button>
                        <button className="fourthlyButton" onClick={e => { const parent = e.currentTarget.parentNode; Array.from(parent.children).forEach(btn => btn.classList.remove('clicked')); e.currentTarget.classList.add('clicked'); }}>Repost</button>
                </div>

                <div style={{ marginTop: "var(--sectionSpacing)", padding: "var(--padding)", background: "var(--fifthly)", borderRadius: "var(--border)" }}>
                    <p style={{ color: "var(--thirdly)", textAlign: "center" }}>{status || "Content for the selected category will appear here."}</p>
                </div>

                {showImagePopup && (
                    <div className="popupOverlay" onClick={() => setShowImagePopup(false)}>
                        <div className="popupContent" onClick={(e) => e.stopPropagation()}>
                            <h2>Update Image</h2>
                            <button className="primaryButton" onClick={() => handleUpdateImage("replace")}>Replace</button>
                            <button className="secondaryButton" onClick={() => handleUpdateImage("delete")}>Delete</button>
                        </div>
                    </div>
                )}

                {showUpdatePopup && (
                    <div className="popupOverlay" onClick={() => setShowUpdatePopup(false)}>
                        <div className="popupContent" onClick={(e) => e.stopPropagation()}>
                            <h2>Update Profile Photo</h2>
                            <button className="primaryButton" onClick={() => handleUpdateImage("replace")}>Upload New</button>
                            <button className="secondaryButton" onClick={() => setShowUpdatePopup(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
}

export default Profile;
