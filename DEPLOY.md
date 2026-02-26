# Deploy The Shield Store

Deploy **frontend** (Vercel) + **backend** (Render) + **database** (MongoDB Atlas) for free.

> **Security:** Never put real credentials in this file or in the repo. Use only placeholders below. Set real values in Render/Vercel environment variables or in local `.env` (and keep `.env` in `.gitignore`). If a MongoDB URI was ever committed, change the database user password in Atlas and update the URI in your deployment env vars.

---

## Launch on Vercel (frontend) – quick steps

1. **Push your project to GitHub** (if you haven’t):
   - Create a new repo at [github.com/new](https://github.com/new).
   - In your project folder run: `git init`, `git add .`, `git commit -m "Initial commit"`, then add the remote and push.

2. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub.

3. **Add New** → **Project** → **Import** your GitHub repo (the one that contains the Shield Store code).

4. **Configure the project:**
   - Click **Root Directory** → **Edit** → choose **`client`** (only the client folder).
   - **Framework Preset:** Create React App (should be auto-detected).
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

5. **Environment Variables** → Add:
   - **Name:** `REACT_APP_API_URL`  
   - **Value:** Your backend API URL **with no trailing slash**  
     - If you’ve deployed the backend on Render, use that URL (e.g. `https://shield-store-api.onrender.com`).  
     - If not deployed yet, leave it empty for now; the site will load but API calls (login, products, etc.) will fail until you add the backend URL and redeploy.

6. Click **Deploy**. When it finishes, Vercel gives you a URL like `https://your-project.vercel.app`.

**Note:** The site needs the **backend** (and database) to be deployed for login, products, and cart to work. See sections 1–2 below for MongoDB Atlas + Render, then set `REACT_APP_API_URL` to your Render URL and redeploy on Vercel.

---

## 1. MongoDB Atlas (database)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a **free cluster** (M0).
3. **Database Access** → Add user (username + password). Note the password.
4. **Network Access** → Add IP: `0.0.0.0/0` (allow from anywhere) for Render.
5. **Database** → Connect → **Drivers** → copy the connection string. It looks like (this is an example only—do not use real credentials here):
   ```text
   mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/shield-ecommerce?retryWrites=true&w=majority
   ```
   Put your **real** connection string only in Render’s Environment Variables (and in local `server/.env`); never commit it to the repo.

---

## 2. Deploy backend (Render)

1. Push your code to **GitHub** (create a repo and push the `Shields` project).
2. Go to [render.com](https://render.com) → Sign up / Log in.
3. **New** → **Web Service**.
4. Connect your GitHub repo. Select the repo that contains `Shields`.
5. Configure:
   - **Name:** `shield-store-api` (or any name).
   - **Root Directory:** `server` (important: only the server folder).
   - **Runtime:** Node.
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance type:** Free.
6. **Environment** (Environment Variables). Add:

   | Key            | Value |
   |----------------|--------|
   | `NODE_ENV`     | `production` |
   | `MONGODB_URI`  | Your Atlas connection string—paste only in Render’s env vars, never in this file or in code. |
   | `JWT_SECRET`   | A long random string (e.g. use a password generator) |
   | `FRONTEND_URL` | Leave empty for now; add after step 3 (e.g. `https://your-app.vercel.app`) |

7. Click **Create Web Service**. Wait for deploy. Copy the service URL (e.g. `https://shield-store-api.onrender.com`). You will set this as `REACT_APP_API_URL` and update `FRONTEND_URL` after deploying the frontend.

---

## 3. Deploy frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) → Sign up / Log in (e.g. with GitHub).
2. **Add New** → **Project** → Import your GitHub repo.
3. Configure:
   - **Root Directory:** Click **Edit** and set to `client` (only the client folder).
   - **Framework Preset:** Create React App (or Vite if you use it).
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
4. **Environment Variables.** Add:

   | Key                   | Value |
   |-----------------------|--------|
   | `REACT_APP_API_URL`   | Your Render backend URL **with no trailing slash** (e.g. `https://shield-store-api.onrender.com`) |

5. Deploy. Vercel will give you a URL like `https://your-project.vercel.app`.
6. **Important:** Go back to **Render** → your backend service → **Environment** → set `FRONTEND_URL` to your Vercel URL (e.g. `https://your-project.vercel.app`). Then **Manual Deploy** → **Deploy latest** so CORS allows your frontend.

---

## 4. Seed the database (optional)

After the backend is deployed and connected to Atlas:

- **Option A – Run seed locally:**  
  In `server` folder create a `.env` with the same `MONGODB_URI` (and `JWT_SECRET`) as on Render, then run:
  ```bash
  cd server
  npm run seed
  ```
- **Option B – Render Shell:**  
  If Render offers a shell, open it, then run `node scripts/seed.js` from the server directory (with env vars already set).

This creates the admin user (`admin@shield.com` / `admin123`) and Free Fire products.

---

## 5. Summary

| Part       | URL / Where        |
|-----------|---------------------|
| Frontend  | `https://your-project.vercel.app` |
| Backend   | `https://shield-store-api.onrender.com` (or your Render URL) |
| Database  | MongoDB Atlas (connection string in Render env) |

- **Store:** Open the Vercel URL.  
- **Admin:** Open `https://your-project.vercel.app/admin/login` and log in with the seeded admin account.

---

## Notes

- **Render free tier:** The backend may sleep after inactivity; the first request can be slow.
- **Vercel:** Free tier is usually enough for the frontend.
- Replace `REACT_APP_API_URL` and `FRONTEND_URL` with your real URLs in the steps above.
