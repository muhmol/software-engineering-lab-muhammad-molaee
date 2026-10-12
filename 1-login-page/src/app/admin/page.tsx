"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminUsers, signOut as clearSession, type PublicUser } from "@/lib/local-database";

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [message, setMessage] = useState("Loading accounts...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadUsers() {
      try {
        const data = await getAdminUsers();
        if (isActive) {
          setUsers(data);
          setMessage("");
        }
      } catch {
        if (isActive) {
          router.replace("/");
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
      clearSession();
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
          <button className="text-button" type="button" onClick={signOut}>Sign out</button>
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
                  <th scope="col">Signed up</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.fullName || "—"}</td>
                    <td>{user.username || "—"}</td>
                    <td>{user.email}</td>
                    <td><span className="role-badge">{user.role}</span></td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {!isLoading && users.length === 0 && (
                  <tr><td colSpan={5}>No accounts have signed up yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
