export default function Home() {
  return (
    <main className="page-shell">
      <section className="login-card" aria-labelledby="login-title">
        <header className="login-header">
          <a className="brand" href="/" aria-label="Northstar home">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 2.75 14.5 9.5 21.25 12l-6.75 2.5L12 21.25 9.5 14.5 2.75 12 9.5 9.5 12 2.75Z" fill="currentColor" />
              </svg>
            </span>
            <span>northstar</span>
          </a>
          <p className="eyebrow">YOUR WORKSPACE AWAITS</p>
          <h1 id="login-title">Welcome back</h1>
          <p className="login-description">Sign in to your account to continue.</p>
        </header>
        <form className="login-form">
          <div className="field-group">
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Enter your password" autoComplete="current-password" required />
          </div>
          <button className="submit-button" type="submit">Sign in</button>
        </form>
      </section>
    </main>
  );
}
