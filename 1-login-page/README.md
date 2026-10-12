# Northstar sign-in and local accounts

A responsive sign-in and sign-up app built with Next.js, React, and Tailwind CSS. A small IndexedDB database stores account profiles in the browser so the app works without a server or database credentials, including on GitHub Pages.

## Try it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Sign up at `/signup/` and enter the same password twice. The default demo administrator can sign in on the home page with:

- Username: `admin`
- Password: `Admin123!`

Admin accounts go to `/admin/` to see accounts saved in this browser.

## Important limitations

This is a local demo database, not a secure shared website database. Accounts exist only in the browser profile and device where they were created; they do not sync between users, computers, or browsers. Browser storage can be inspected or changed, and the demo admin password is public. Passwords are stored as salted PBKDF2 hashes, but this does not make client-side authentication suitable for real users or sensitive information.

GitHub Pages cannot run a private server or database. For a real multi-user deployment with protected admin access, use a server-backed host and a hosted database/authentication provider.

Use `npm run lint` to check the code and `npm run build` to create a production build.
