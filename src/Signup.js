import { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

export function Signup({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setError('');
    console.log('Signup submitted:', { email, password, displayName });
  }

  function handleGoogleSignup() {

    console.log('Google signup clicked');
  }

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: '998',
        transition: 'opacity 0.3s ease',
      }} />
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '999',
        background: 'var(--fifthly)',
        padding: '2rem',
        borderRadius: 'var(--border)',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        transition: 'opacity 0.3s ease',
      }}>
        <h1 style={{ color: 'var(--primary)', textAlign: 'center', marginBottom: '2rem' }}>
          Create Psaltos Account
        </h1>

        <h2 onClick={onClose} 
          style={{ color: "var(--secondary)", fontSize: "1rem", cursor: "pointer", position: 'absolute', top: '1rem', right: '1rem' }}>
          x
        </h2>

        {error && (
          <div style={{
            background: '#ff4444',
            color: 'white',
            padding: '1rem',
            borderRadius: 'var(--border)',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--border)',
                border: '2px solid var(--primary)',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--border)',
                border: '2px solid var(--primary)',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--border)',
                border: '2px solid var(--primary)',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--border)',
                border: '2px solid var(--primary)',
                fontSize: '1rem'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'var(--primary)',
              color: 'var(--fifthly)',
              padding: '1rem',
              borderRadius: 'var(--border)',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              marginTop: '1rem'
            }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          margin: '1.5rem 0',
          color: 'var(--fourthy)'
        }}>
          OR
        </div>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          style={{
            width: '100%',
            background: 'white',
            color: '#333',
            padding: '1rem',
            borderRadius: 'var(--border)',
            border: '2px solid var(--primary)',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.64 2.84 15.92 2 14 2 9.86 2 6.16 4.24 4.58 7.43l3.26 2.5c.9-2.07 3.03-3.43 5.16-3.43z"/>
          </svg>
          Sign up with Google
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--primary)' }}>
          Already have an account? <span onClick={onClose} style={{ color: 'var(--secondary)', fontWeight: 'bold', cursor: 'pointer' }}>Sign In</span>
        </p>
      </div>
    </>
  );
}