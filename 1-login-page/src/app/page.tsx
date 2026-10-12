export default function Home() {
  return (
    <main className="page-shell">
      <section className="login-card" aria-labelledby="login-title">
        <header className="login-header">
          <h1 id="login-title">Sign in</h1>
        </header>
        <form className="login-form">
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
          <button type="submit">Sign in</button>
        </form>
      </section>
    </main>
  );
}
