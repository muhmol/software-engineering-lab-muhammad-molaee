"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserProfile = {
  id: string;
  full_name: string;
  username: string | null;
  email: string;
  role: "user" | "admin";
  email_verified: boolean;
  created_at: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [message, setMessage] = useState("Loading accounts...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadUsers() {
      try {
        const response = await fetch("/api/admin/users", { cache: "no-store" });
        if (response.status === 401) {
          router.replace("/");
          return;
        }
        if (response.status === 403) {
          router.replace("/account/");
          return;
        }
        const result: { users?: UserProfile[]; error?: string } = await response.json();
        if (!response.ok || !result.users) throw new Error(result.error || "Unable to load accounts.");
        if (isActive) {
          setUsers(result.users);
          setMessage("");
        }
      } catch (error) {
        if (isActive) {
          setMessage(error instanceof Error ? error.message : "Unable to load registered accounts.");
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadUsers();
    return () => {
      isActive = false;
    };
  }, [router]);

  async function signOut() {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      const result: { error?: string } = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to sign out.");
      router.replace("/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign out.");
    }
  }

  return (
    <main className="page-shell admin-shell">
      <section className="admin-card" aria-labelledby="admin-title">
        <header className="admin-header">
          <div>
            <p className="eyebrow"><span className="eyebrow-dot" /> NORTHSTAR ADMIN</p>
            <h1 id="admin-title">Registered users</h1>
            <p className="login-description">Accounts created in your workspace.</p>
          </div>
          <button className="text-button admin-signout" type="button" onClick={signOut}>Sign out</button>
        </header>
        {message ? (
          <p className="admin-message" role="status">{message}</p>
        ) : (
          <div className="table-wrap">
            <table className="users-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Username</th>
                  <th scope="col">Email</th>
                  <th scope="col">Role</th>
                  <th scope="col">Email status</th>
                  <th scope="col">Signed up</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.full_name || "—"}</td>
                    <td>{user.username || "—"}</td>
                    <td>{user.email}</td>
                    <td><span className="role-badge">{user.role}</span></td>
                    <td>{user.email_verified ? "Verified" : "Pending"}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {!isLoading && users.length === 0 && (
                  <tr><td colSpan={6}>No accounts have signed up yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
