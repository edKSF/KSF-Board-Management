# BoardHub – Board Management Suite

A full-featured, AI-powered board management portal for nonprofit and corporate boards.

## Features
- 📅 Meeting management with agendas & attendees
- 🎥 Video meeting room with live chat
- 📁 Document center with categories
- ✅ Kanban task manager (persisted)
- 🗳️ Polls & voting with live results (persisted)
- 🤖 AI Minutes Maker – generates formal minutes from agenda
- 🎨 AI Slide Outline Generator – generates slide decks from agenda
- 👥 Board member directory
- 💬 Discussions board
- 🔒 Password-gated login (default: `Board2026!`)
- 💾 Data persists across browser sessions via localStorage

---

## Deploy in 5 Minutes (Vercel — Recommended)

### Option A: Drag & Drop (Fastest)
1. Go to [vercel.com](https://vercel.com) and create a free account
2. Click **"Add New Project"**
3. Drag this entire `boardhub` folder into the upload zone
4. Click **Deploy**
5. Vercel gives you a live URL like `https://boardhub-xyz.vercel.app`
6. Share that URL with your board

### Option B: GitHub + Vercel (Best for ongoing updates)
1. Create a new GitHub repo at [github.com/new](https://github.com/new)
2. Upload all files in this folder to the repo
3. Go to [vercel.com](https://vercel.com) → New Project → Import Git Repository
4. Select your repo → Deploy
5. Every time you update the code, Vercel auto-redeploys

### Option C: CodeSandbox (No account needed, instant)
1. Go to [codesandbox.io](https://codesandbox.io)
2. Create new → React (Vite)
3. Delete their example files, upload yours
4. Hit Share → get a public URL immediately

---

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## Customization

### Change the password
In `src/App.jsx`, find:
```js
const BOARD_PASSWORD = "Board2026!";
```
Change it to any password you like.

### Update board members
In `src/App.jsx`, find the `STATIC.members` array and edit names, roles, emails.

### Update meetings & agenda
In `src/App.jsx`, find the `STATIC.meetings` array.

---

## Tech Stack
- React 18 + Vite
- No external UI libraries
- Claude API (claude-sonnet-4-20250514) for AI Minutes and Slide Outlines
- localStorage for data persistence

---

## Security Note
This app uses a simple shared password for board access. For production with sensitive board materials, consider adding proper authentication (Auth0, Clerk, Supabase Auth).
