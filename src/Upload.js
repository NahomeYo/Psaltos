import { useState, useContext } from 'react';
import { AuthContext } from './AuthContext.js';
import { uploadHymn } from './api.js';
import './App.css';

export function Upload({ height }) {
    const { authenticated } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!audioFile) {
            setStatus('Please select an audio file.');
            return;
        }
        setLoading(true);
        setStatus('');
        try {
            await uploadHymn({ title, audio_file: audioFile });
            setStatus('Upload complete.');
            setTitle('');
            setAudioFile(null);
        } catch (err) {
            setStatus(err.message || 'Upload failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ paddingTop: height, width: "var(--pageWidth)", margin: "var(--paddingSides)" }}>
            <div className="interfaceLeft" style={{ padding: "var(--padding)", borderRadius: "var(--border)" }}>
                <h1 style={{ color: "var(--primary)" }}>Upload Hymn</h1>
                {!authenticated && (
                    <p style={{ color: "var(--thirdly)" }}>Please sign in to upload hymns.</p>
                )}
                {authenticated && (
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--padding)" }}>
                        <input
                            type="text"
                            placeholder="Hymn title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
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
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                            required
                            style={{ color: "var(--thirdly)" }}
                        />
                        <button className="primaryButton" type="submit" disabled={loading}>
                            {loading ? 'Uploading...' : 'Upload'}
                        </button>
                        {status && <p style={{ color: "var(--thirdly)" }}>{status}</p>}
                    </form>
                )}
            </div>
        </div>
    )
}

export default Upload;
