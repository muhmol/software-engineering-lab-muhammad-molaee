# Northstar accounts

The app is a static GitHub Pages frontend backed by Supabase Auth and Postgres. Cloudflare Turnstile protects public sign-up; Supabase verifies the CAPTCHA token on its servers. User profiles are stored in Supabase, not in the visitor's browser.

## Required one-time setup

1. Create a Supabase project and a Cloudflare Turnstile widget for the live domain (`muhmol.github.io`). Add `localhost` to the Turnstile allowed hostnames if testing locally.
2. In the Supabase SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql). It creates the profile table and signup trigger, and restricts profile reads to the account owner and admins.
3. In Supabase **Authentication → Security and Protection → CAPTCHA**, enable CAPTCHA, choose **Cloudflare Turnstile**, and paste the Turnstile **secret key**. Supabase uses this secret to validate sign-up tokens server-side.
4. In Supabase **Authentication → URL Configuration**, set the Site URL to `https://muhmol.github.io/software-engineering-lab-muhammad-molaee/` and add that URL (and `http://localhost:3000/**` for local development) to the allowed redirect URLs.
5. Create `1-login-page/.env.local` from `.env.example`. Fill in the Supabase project URL, publishable/anon key, Turnstile **site key**, admin email, service-role key, and a unique admin password of at least 12 characters. Never commit `.env.local` or expose the service-role key or admin password.
6. Create the administrator account from the `1-login-page` directory:

   ```bash
   npm run create-admin
   ```

   Sign in with username `admin` and the admin password you chose. The admin email is resolved from `NEXT_PUBLIC_ADMIN_EMAIL`.
7. In GitHub repository **Settings → Secrets and variables → Actions → Variables**, add these **public** build variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - `NEXT_PUBLIC_ADMIN_EMAIL`

   These contain the public Supabase project URL, publishable/anon key, CAPTCHA site key, and admin email. Do **not** create GitHub variables for `SUPABASE_SERVICE_ROLE_KEY` or `ADMIN_PASSWORD`; the static app does not need them.
8. Push to `main` to deploy. The GitHub Pages action builds the static frontend; Supabase provides the database, authentication, and server-side CAPTCHA validation.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the same `.env.local` project settings and configure the local development host in Turnstile and the Supabase redirect URL list.

New sign-ups must complete the Turnstile challenge and enter a matching password twice. Their profile is created by a database trigger. If email confirmation is enabled in Supabase, users should confirm their email before signing in.

## Security and existing demo data

Supabase Auth stores password credentials; the app never reads or displays passwords. Row-level security prevents ordinary accounts from listing other profiles, and admin access is granted only by the private provisioning script. The old IndexedDB demo accounts are not copied into Supabase; sign up again after setup. GitHub Pages itself remains a static host and does not run the database.

Use `npm run lint` to check the code and `npm run build` to create a production build.
