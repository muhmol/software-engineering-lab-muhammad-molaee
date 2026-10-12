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
          <p className="eyebrow">YOUR WORKSPACE AWAITS</p>
          <h1 id="login-title">Welcome back</h1>
          <p className="login-description">Sign in to your account to continue.</p>
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
            <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
          </div>
          <div className="field-group">
            <div className="field-label-row">
              <label htmlFor="password">Password</label>
              <button
                className="text-button"
                type="button"
                onClick={() => setMessage("Password recovery is not configured yet. Contact your workspace administrator.")}
              >
                Forgot password?
              </button>
            </div>
            <div className="password-input">
              <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" autoComplete="current-password" required />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="form-options">
            <label className="remember-option">
              <input type="checkbox" name="remember" />
              <span>Remember me</span>
            </label>
          </div>
          <button className="submit-button" type="submit">Sign in</button>
          <p className="form-message" role="status" aria-live="polite">{message}</p>
        </form>
        <p className="login-footer">Your next great idea is one sign-in away.</p>
      </section>
    </main>
  );
}
