# Glassspace — React Login & Sign Up ( Using Supabase )

## Run it
1. Install Node.js (LTS) if it is not already installed.
2. Open this folder in VS Code.
3. Open Terminal and run:

```bash
npm install
npm run dev
```

4. Open the localhost URL Vite prints in the terminal.

## Components
- `src/App.jsx` — page layout and state for the active side.
- `src/components/AuthCard.jsx` — 3D flipping glass card.
- `src/components/LoginForm.jsx` — login validation and demo login logic.
- `src/components/RegisterForm.jsx` — registration validation and localStorage demo account.
- `src/Stylization.css` — visual design, glass effect, responsive styles, and flip animation.

## Demo-only security note
This is a frontend learning project. It stores a demo user's password in browser localStorage and does not provide secure real-world authentication. Do not use real credentials. A production app needs a backend, password hashing, and proper session management.
