"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type UserProfile = {
  id: string;
  full_name: string;
  username: string | null;
  email: string;
  role: "user" | "admin";
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
        const supabase = getSupabaseBrowserClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) {
          router.replace("/");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;
        if (profile.role !== "admin") {
          router.replace("/");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, username, email, role, created_at")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (isActive) {
          setUsers(data ?? []);
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
      const { error } = await getSupabaseBrowserClient().auth.signOut();
      if (error) throw error;
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
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
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
