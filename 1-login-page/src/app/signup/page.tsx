"use client";

import Link from "next/link";
import { useState } from "react";
import { registerUser } from "@/lib/local-database";

export default function SignupPage() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <main className="page-shell">
      <section className="login-card" aria-labelledby="signup-title">
        <header className="login-header">
          <Link className="brand" href="/" aria-label="Northstar home">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 2.75 14.5 9.5 21.25 12l-6.75 2.5L12 21.25 9.5 14.5 2.75 12 9.5 9.5 12 2.75Z" fill="currentColor" />
              </svg>
            </span>
            <span>northstar</span>
          </Link>
          <p className="eyebrow"><span className="eyebrow-dot" /> CREATE YOUR ACCOUNT</p>
          <h1 id="signup-title">Join Northstar</h1>
          <p className="login-description">Create an account to get started with your workspace.</p>
        </header>
        <form
          className="login-form"
          onSubmit={async (event) => {
            event.preventDefault();
            setMessage("");
            setIsSubmitting(true);
            const form = event.currentTarget;

            try {
              const formData = new FormData(form);
              const password = String(formData.get("password"));
              const confirmPassword = String(formData.get("confirmPassword"));

              if (password !== confirmPassword) {
                setMessage("The passwords do not match. Please enter them again.");
                return;
              }

              await registerUser({
                fullName: String(formData.get("fullName")),
                email: String(formData.get("email")),
                password,
              });

              setMessage("Your account was created. You can now sign in.");
              form.reset();
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "Unable to create your account. Please try again.");
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <div className="field-group">
            <label htmlFor="fullName">Full name</label>
            <div className="input-with-icon">
              <input id="fullName" name="fullName" type="text" placeholder="Your name" autoComplete="name" maxLength={100} required />
            </div>
          </div>
          <div className="field-group">
            <label htmlFor="email">Email address</label>
            <div className="input-with-icon">
              <input id="email" name="email" type="email" placeholder="name@company.com" autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} required />
            </div>
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <input id="password" name="password" type="password" placeholder="At least 8 characters" autoComplete="new-password" minLength={8} required />
            </div>
            <span className="field-hint">Use at least 8 characters.</span>
          </div>
          <div className="field-group">
            <label htmlFor="confirmPassword">Enter password again</label>
            <div className="input-with-icon">
              <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Re-enter your password" autoComplete="new-password" minLength={8} required />
            </div>
          </div>
          <button className="submit-button" type="submit" disabled={isSubmitting}>
            <span>{isSubmitting ? "Creating account..." : "Create account"}</span>
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="form-message" role="status" aria-live="polite">{message}</p>
        </form>
        <div className="signup-section">
          <p>Already have an account?</p>
          <Link className="signup-button" href="/">Sign in</Link>
        </div>
      </section>
    </main>
  );
}
