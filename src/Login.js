import React, { useState } from 'react';
import './App.css';
import { login, register } from './api.js';

export function Login({ onClose, displaySignUp, onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({ username_or_email: email, password });
      await onAuthSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    console.log('Google login clicked');
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
      <div className="signUpForm"
        style={{
          display: 'flex',
          flexDirection: "column",
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          height: "auto",
          width: "50vw",
          padding: 'var(--padding)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: "999",
          background: "var(--primary)",
          borderRadius: '10px',
          overflowY: 'auto',
          gap: "var(--sectionSpacing)",
          position: 'fixed',
          transition: 'opacity 0.3s ease',
        }}>

        <span style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
          <t2 style={{ color: 'var(--thirdly)', fontSize: '1rem', fontWeight: "600", textAlign: "center", width: "100%" }}>
            Sign in or create an account
          </t2>

          <h2 onClick={onClose}
            style={{ fontFamily: "Intel-light", color: "var(--secondary)", fontSize: "1rem", cursor: "pointer" }}>
            x
          </h2>
        </span>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            background: '#3b5998',
            color: 'white',
            padding: 'var(--padding)',
            borderRadius: '4px',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Continue with Facebook
        </button>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            background: '#333',
            color: 'white',
            padding: 'var(--padding)',
            borderRadius: '4px',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <span style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{
            textAlign: 'start',
            color: '#ccc',
            fontSize: '0.65rem',
            fontWeight: '600',
          }}>
            Or with email
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address or profile URL"
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
        </span>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
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

          {error && (
            <div style={{
              background: '#ff4444',
              color: 'white',
              padding: '1rem',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            className="secondaryButton"
            type="submit"
            disabled={loading}
          >
            <h2 style={{ color: "var(--primaryColor)" }}>{loading ? 'Signing in...' : 'Continue'}</h2>
          </button>

          <button
            className="thirdlyButton"
            type="button"
            disabled={loading}
            onClick={displaySignUp}
          >
            <h2 style={{ color: "var(--primaryColor)" }}>Don't have an account? Sign up!</h2>
          </button>
        </form>
      </div>
    </>
  );
}

export function Signup({ onClose, onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setError('');
    setLoading(true);
    try {
      await register({
        username: email.split('@')[0],
        email,
        password,
        display_name: displayName,
      });
      await onAuthSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
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
      <div className="signUpForm"
        style={{
          display: 'flex',
          flexDirection: "column",
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          height: "auto",
          width: "50vw",
          padding: 'var(--padding)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: "999",
          background: "var(--primary)",
          borderRadius: '10px',
          overflowY: 'auto',
          gap: "var(--sectionSpacing)",
          position: 'fixed',
          transition: 'opacity 0.3s ease',
        }}>

        <span style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
          <t2 style={{ fontSize: '1rem', fontWeight: "600", textAlign: "center", width: "100%" }}>
            Create an Account
          </t2>

          <h2 onClick={onClose}
            style={{ fontFamily: "Intel-light", color: "var(--secondary)", fontSize: "1rem", cursor: "pointer" }}>
            x
          </h2>
        </span>

        {error && (
          <div style={{
            background: '#ff4444',
            color: 'white',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display Name"
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
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
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
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
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

          <button
            type="submit"
            disabled={loading}
            className="thirdlyButton"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </>
  );
}
