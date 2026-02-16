import './App.css';
import "./animation.css";
import "./media.css";
import "./interfaceMain.css";
import { useState, useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import Robe from "./img/robe.svg";
import shareButton from "./img/share.svg";
import editButton from "./img/editIcon.svg";
import { AuthContext } from './AuthContext.js';
import { updateProfile, resolveMediaUrl, getPlaylists, getLikes, createPlaylist, updatePlaylist } from './api.js';

export function Profile({ height }) {
    const { authenticated, user, refresh } = useContext(AuthContext);
    const location = useLocation();
    const userName = user?.profile?.display_name || user?.username || "User";
    const [showImagePopup, setShowImagePopup] = useState(false);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [status, setStatus] = useState('');
    const fileInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState('all');
    const [playlists, setPlaylists] = useState([]);
    const [likes, setLikes] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
    const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
    const [newPlaylistPublic, setNewPlaylistPublic] = useState(false);
    const [newPlaylistThumbnail, setNewPlaylistThumbnail] = useState(null);
    const [displayName, setDisplayName] = useState(user?.profile?.display_name || '');

    useEffect(() => {
        setDisplayName(user?.profile?.display_name || '');
    }, [user]);

    useEffect(() => {
        if (!authenticated) {
            setStatus('Please sign in to view your profile.');
        } else {
            setStatus('');
        }
    }, [authenticated]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        const create = params.get('create');
        if (tab) {
            setActiveTab(tab);
        }
        if (create === '1') {
            setActiveTab('playlists');
            setShowCreatePlaylist(true);
        }
    }, [location.search]);

    useEffect(() => {
        if (!authenticated) {
            setPlaylists([]);
            setLikes([]);
            return;
        }
        const loadLibrary = async () => {
            try {
                const [playlistData, likeData] = await Promise.all([getPlaylists(), getLikes()]);
                setPlaylists(Array.isArray(playlistData) ? playlistData : []);
                setLikes(Array.isArray(likeData) ? likeData : []);
            } catch (err) {
                setPlaylists([]);
                setLikes([]);
            }
        };
        loadLibrary();
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

    const handleDisplayNameSave = async () => {
        if (!displayName.trim()) {
            setStatus('Display name cannot be empty.');
            return;
        }
        try {
            await updateProfile({ display_name: displayName.trim() });
            await refresh();
            setStatus('Display name updated.');
        } catch (err) {
            setStatus(err.message || 'Update failed.');
        }
    };

    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        if (!newPlaylistTitle.trim()) {
            setStatus('Please enter a playlist title.');
            return;
        }
        try {
            await createPlaylist({
                title: newPlaylistTitle.trim(),
                is_public: newPlaylistPublic,
                thumbnail: newPlaylistThumbnail,
            });
            const playlistData = await getPlaylists();
            setPlaylists(Array.isArray(playlistData) ? playlistData : []);
            setNewPlaylistTitle('');
            setNewPlaylistPublic(false);
            setNewPlaylistThumbnail(null);
            setShowCreatePlaylist(false);
            setStatus('Playlist created.');
        } catch (err) {
            setStatus(err.message || 'Failed to create playlist.');
        }
    };

    const handlePlaylistVisibility = async (playlist, isPublic) => {
        try {
            const updated = await updatePlaylist(playlist.id, { is_public: isPublic });
            setPlaylists((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            if (selectedPlaylist?.id === updated.id) {
                setSelectedPlaylist(updated);
            }
            setStatus('Playlist visibility updated.');
        } catch (err) {
            setStatus(err.message || 'Failed to update playlist.');
        }
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

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", padding: 0, gap: "var(--sectionSpacing)", margin: "var(--sectionSpacing) 0" }}>
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

                <span style={{ flexBasis: "20%", flexGrow: 0, display: "flex", justifyContent: "space-between", height: "100%", alignItems: "center", borderRadius: "var(--padding)", gap: "calc(var(--sectionSpacing) /2)" }}>
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
                        <button className={`fourthlyButton ${activeTab === 'all' ? 'clicked' : ''}`} onClick={() => setActiveTab('all')}>All</button>
                        <button className={`fourthlyButton ${activeTab === 'likes' ? 'clicked' : ''}`} onClick={() => setActiveTab('likes')}>Likes</button>
                        <button className={`fourthlyButton ${activeTab === 'playlists' ? 'clicked' : ''}`} onClick={() => setActiveTab('playlists')}>Playlists</button>
                        <button className={`fourthlyButton ${activeTab === 'repost' ? 'clicked' : ''}`} onClick={() => setActiveTab('repost')}>Repost</button>
                </div>

                <div style={{ marginTop: "var(--sectionSpacing)", padding: "var(--padding)", background: "var(--fifthly)", borderRadius: "var(--border)" }}>
                    <p style={{ color: "var(--thirdly)", textAlign: "center" }}>{status || "Content for the selected category will appear here."}</p>
                </div>

                {activeTab === 'all' && (
                    <div style={{ marginTop: "var(--sectionSpacing)", display: "flex", flexDirection: "column", gap: "var(--padding)" }}>
                        <div style={{ display: "flex", gap: "var(--padding)", alignItems: "center" }}>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Display name"
                                style={{
                                    padding: 'var(--padding)',
                                    borderRadius: '4px',
                                    border: '1px solid var(--primary)',
                                    fontSize: 'var(--border)',
                                    fontFamily: "BoucherieSans",
                                    background: 'var(--sixthly)',
                                    color: 'var(--fourthy)',
                                    outline: 'none',
                                    paddingLeft: "var(--padding)",
                                }}
                            />
                            <button className="primaryButton" onClick={handleDisplayNameSave}>Save</button>
                        </div>
                    </div>
                )}

                {activeTab === 'playlists' && (
                    <div style={{ marginTop: "var(--sectionSpacing)", display: "flex", flexDirection: "column", gap: "var(--sectionSpacing)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ color: "var(--thirdly)" }}>Playlists</h2>
                            <button className="primaryButton" onClick={() => setShowCreatePlaylist(true)}>Create a playlist</button>
                        </div>

                        <div style={{ display: "flex", gap: "var(--sectionSpacing)" }}>
                            <div style={{ flexBasis: "35%", display: "flex", flexDirection: "column", gap: "var(--padding)" }}>
                                {playlists.map((playlist) => (
                                    <div
                                        key={playlist.id}
                                        className="interfaceLeft"
                                        style={{ padding: "var(--padding)", cursor: "pointer" }}
                                        onClick={() => setSelectedPlaylist(playlist)}
                                    >
                                        <p style={{ color: "var(--secondary)", margin: 0 }}>{playlist.title}</p>
                                        <p style={{ color: "var(--thirdly)", margin: 0 }}>{playlist.is_public ? 'Public' : 'Private'}</p>
                                    </div>
                                ))}
                                {playlists.length === 0 && (
                                    <p style={{ color: "var(--thirdly)" }}>No playlists yet.</p>
                                )}
                            </div>

                            <div style={{ flexGrow: 1 }} className="interfaceRight">
                                {selectedPlaylist ? (
                                    <div style={{ padding: "var(--padding)" }}>
                                        <h2 style={{ color: "var(--secondary)" }}>{selectedPlaylist.title}</h2>
                                        <label style={{ color: "var(--thirdly)", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedPlaylist.is_public}
                                                onChange={(e) => handlePlaylistVisibility(selectedPlaylist, e.target.checked)}
                                            />
                                            Public playlist
                                        </label>
                                        <div style={{ marginTop: "var(--padding)" }}>
                                            {selectedPlaylist.items?.map((item) => (
                                                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "var(--padding)" }}>
                                                    <p style={{ color: "var(--secondary)", margin: 0 }}>{item.hymn?.title || 'Untitled hymn'}</p>
                                                </div>
                                            ))}
                                            {(!selectedPlaylist.items || selectedPlaylist.items.length === 0) && (
                                                <p style={{ color: "var(--thirdly)" }}>No hymns in this playlist yet.</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ padding: "var(--padding)" }}>
                                        <p style={{ color: "var(--thirdly)" }}>Select a playlist to view details.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'likes' && (
                    <div style={{ marginTop: "var(--sectionSpacing)" }}>
                        {likes.map((like) => (
                            <div key={like.id} style={{ padding: "var(--padding)" }}>
                                <p style={{ color: "var(--secondary)", margin: 0 }}>{like.hymn?.title || 'Liked hymn'}</p>
                            </div>
                        ))}
                        {likes.length === 0 && (
                            <p style={{ color: "var(--thirdly)" }}>No liked hymns yet.</p>
                        )}
                    </div>
                )}

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

                {showCreatePlaylist && (
                    <div className="popupOverlay" onClick={() => setShowCreatePlaylist(false)}>
                        <div className="popupContent" onClick={(e) => e.stopPropagation()}>
                            <h2>Create Playlist</h2>
                            <form onSubmit={handleCreatePlaylist} style={{ display: "flex", flexDirection: "column", gap: "var(--padding)" }}>
                                <input
                                    type="text"
                                    placeholder="Playlist title"
                                    value={newPlaylistTitle}
                                    onChange={(e) => setNewPlaylistTitle(e.target.value)}
                                    required
                                    style={{
                                        padding: 'var(--padding)',
                                        borderRadius: '4px',
                                        border: '1px solid var(--primary)',
                                        fontSize: 'var(--border)',
                                        fontFamily: "BoucherieSans",
                                        background: 'var(--sixthly)',
                                        color: 'var(--fourthy)',
                                        outline: 'none',
                                        paddingLeft: "var(--padding)",
                                    }}
                                />
                                <label style={{ color: "var(--thirdly)", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                    <input
                                        type="checkbox"
                                        checked={newPlaylistPublic}
                                        onChange={(e) => setNewPlaylistPublic(e.target.checked)}
                                    />
                                    Public playlist
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setNewPlaylistThumbnail(e.target.files?.[0] || null)}
                                />
                                <button className="primaryButton" type="submit">Create</button>
                                <button className="secondaryButton" type="button" onClick={() => setShowCreatePlaylist(false)}>Cancel</button>
                            </form>
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
