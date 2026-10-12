import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!url || !serviceRoleKey || !email || !password) {
  console.error(
    "Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_ADMIN_EMAIL, and ADMIN_PASSWORD in .env.local.",
  );
  process.exit(1);
}

if (password.length < 12) {
  console.error("ADMIN_PASSWORD must contain at least 12 characters.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: {
    full_name: "Workspace Administrator",
    username: "admin",
  },
});

if (error) {
  console.error(`Could not create the admin account: ${error.message}`);
  process.exit(1);
}

const { error: roleError } = await supabase
  .from("profiles")
  .update({ role: "admin" })
  .eq("id", data.user.id);

if (roleError) {
  console.error(`Admin account created, but its admin role could not be assigned: ${roleError.message}`);
  process.exit(1);
}

console.log(`Admin account created for ${email}. Sign in using username "admin".`);
