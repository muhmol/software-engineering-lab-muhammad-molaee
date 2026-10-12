"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSignedInUser, signOut, type PublicUser } from "@/lib/local-database";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [message, setMessage] = useState("Loading your account...");

  useEffect(() => {
    let isActive = true;

    async function loadAccount() {
      try {
        const account = await getSignedInUser();
        if (!account) {
          router.replace("/");
          return;
        }

        if (isActive) {
          setUser(account);
          setMessage("");
        }
      } catch (error) {
        if (isActive) {
          setMessage(error instanceof Error ? error.message : "Unable to load your account.");
        }
      }
    }

    void loadAccount();
    return () => {
      isActive = false;
    };
  }, [router]);

  function handleSignOut() {
    try {
      signOut();
      router.replace("/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign out.");
    }
  }

  return (
    <main className="page-shell">
      <section className="login-card account-card" aria-labelledby="account-title">
        <header className="login-header">
          <Link className="brand" href="/" aria-label="Northstar home">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 2.75 14.5 9.5 21.25 12l-6.75 2.5L12 21.25 9.5 14.5 2.75 12 9.5 9.5 12 2.75Z" fill="currentColor" />
              </svg>
            </span>
            <span>northstar</span>
          </Link>
          <p className="eyebrow"><span className="eyebrow-dot" /> YOUR NORTHSTAR SPACE</p>
          <h1 id="account-title">{user ? `Hello, ${user.fullName}!` : "Welcome"}</h1>
          <p className="login-description">We’re glad you’re here. Here’s a quick look at your account details.</p>
        </header>
        {user ? (
          <dl className="account-details">
            <div>
              <dt>Your name</dt>
              <dd>{user.fullName}</dd>
            </div>
            <div>
              <dt>Email address</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>Username</dt>
              <dd>{user.username || "—"}</dd>
            </div>
          </dl>
        ) : (
          <p className="admin-message" role="status">{message}</p>
        )}
        {user && (
          <>
            <p className="account-security-note">
              <span aria-hidden="true">🔒 </span>
              Your password is kept private and can’t be viewed here.
            </p>
            <button className="submit-button account-signout" type="button" onClick={handleSignOut}>Sign out of your account</button>
          </>
        )}
      </section>
    </main>
  );
}
