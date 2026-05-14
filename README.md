# ⚡ Match Analyst — AI Sports Predictions

AI-powered match analysis and win probability for any upcoming sports fixture, built with React + Vite and the Anthropic Claude API.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Add your API key (optional but recommended)
```bash
cp .env.example .env
# Edit .env and replace the placeholder with your real key
```
Get a key at [console.anthropic.com](https://console.anthropic.com).

> If you skip this step, users will be prompted to enter their own API key when they open the app.

### 3. Run locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

---

## 🌐 Deploy to Vercel (free)

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → import your repo
3. In **Environment Variables**, add:
   - `VITE_ANTHROPIC_API_KEY` = your Anthropic API key
4. Click **Deploy** — you'll get a live URL in ~60 seconds

---

## 🌐 Deploy to Netlify (free)

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → Add new site → import from Git
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Under **Environment variables**, add `VITE_ANTHROPIC_API_KEY`
6. Deploy

---

## 📁 Project Structure

```
match-analyst/
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration
├── package.json
├── .env.example            # Copy to .env and add your key
└── src/
    ├── main.jsx            # React root
    ├── index.css           # Global styles & animations
    ├── App.jsx             # API key gate screen
    └── MatchAnalyst.jsx    # Main app component
```

---

## 🛠 Tech Stack

- **React 18** + **Vite 5**
- **Anthropic Claude API** (claude-sonnet-4) with web search
- Zero external UI dependencies — pure CSS styling

---

## ⚠️ Note

This app calls the Anthropic API directly from the browser. For a production app with many users, consider routing API calls through a backend server to protect your API key and manage costs.
