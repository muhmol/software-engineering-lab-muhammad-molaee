"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <main className="page-shell">
      <section className="login-card" aria-labelledby="login-title">
        <header className="login-header">
          <Link className="brand" href="/" aria-label="Northstar home">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 2.75 14.5 9.5 21.25 12l-6.75 2.5L12 21.25 9.5 14.5 2.75 12 9.5 9.5 12 2.75Z" fill="currentColor" />
              </svg>
            </span>
            <span>northstar</span>
          </Link>
          <p className="eyebrow"><span className="eyebrow-dot" /> WORKSPACE SIGN-IN</p>
          <h1 id="login-title">Welcome back</h1>
          <p className="login-description">Sign in with your Northstar account to pick up where your team left off.</p>
        </header>
        <form
          className="login-form"
          onSubmit={(event) => {
            event.preventDefault();
            setMessage("The sign-in form is ready to connect to an authentication provider.");
          }}
        >
          <div className="field-group">
            <label htmlFor="email">Email address</label>
            <div className="input-with-icon">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                <rect x="2.5" y="4" width="15" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="m3.5 5.5 6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input id="email" name="email" type="email" placeholder="name@company.com" autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} aria-describedby="email-hint" required />
            </div>
            <span className="field-hint" id="email-hint">Use the email address associated with your workspace.</span>
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <svg className="password-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none">
                <rect x="3.5" y="8.5" width="13" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6.5 8.5V6a3.5 3.5 0 0 1 7 0v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" autoComplete="current-password" required />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                    <path d="M2.5 10s2.7-5 7.5-5 7.5 5 7.5 5-2.7 5-7.5 5-7.5-5-7.5-5Z" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                ) : (
                  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                    <path d="M3 3 17 17M8.6 5.2A7 7 0 0 1 10 5c4.8 0 7.5 5 7.5 5a12 12 0 0 1-2 2.4M5.4 5.9C3.5 7.1 2.5 10 2.5 10s2.7 5 7.5 5a7 7 0 0 0 2-.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
            <div className="password-footer">
              <button
                className="text-button"
                type="button"
                onClick={() => setMessage("Password recovery is not configured yet. Contact your workspace administrator.")}
              >
                Forgot password?
              </button>
            </div>
          </div>
          <div className="form-options">
            <label className="remember-option">
              <input type="checkbox" name="remember" />
              <span>Remember me</span>
            </label>
          </div>
          <button className="submit-button" type="submit">
            <span>Sign in</span>
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="form-message" role="status" aria-live="polite">{message}</p>
        </form>
        <div className="signup-section">
          <p>New to Northstar?</p>
          <button
            className="signup-button"
            type="button"
            onClick={() => setMessage("Account creation is not configured yet. Contact your workspace administrator.")}
          >
            Create an account
          </button>
        </div>
        <p className="login-footer">
          <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
            <path d="M8 7v4m0-6h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Sign-in and account creation are demo interactions; authentication is not connected.
        </p>
      </section>
    </main>
  );
}
