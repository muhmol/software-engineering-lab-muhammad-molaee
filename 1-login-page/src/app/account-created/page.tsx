import Link from "next/link";

export default function AccountCreatedPage() {
  return (
    <main className="page-shell">
      <section className="login-card confirmation-card" aria-labelledby="confirmation-title">
        <Link className="brand" href="/" aria-label="Northstar home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2.75 14.5 9.5 21.25 12l-6.75 2.5L12 21.25 9.5 14.5 2.75 12 9.5 9.5 12 2.75Z" fill="currentColor" />
            </svg>
          </span>
          <span>northstar</span>
        </Link>
        <div className="confirmation-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="m7 12.5 3.2 3.2L17.5 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="eyebrow"><span className="eyebrow-dot" /> YOU’RE ALL SET</p>
        <h1 id="confirmation-title">Your account is ready!</h1>
        <p className="confirmation-description">
          Welcome to Northstar. Your account has been created and saved securely. If email confirmation is enabled, check your inbox before signing in.
        </p>
        <Link className="submit-button confirmation-submit" href="/">
          <span>Sign in to your account</span>
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
            <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <p className="confirmation-footer">
          Your details are saved in this browser.
        </p>
      </section>
    </main>
  );
}
