# How to Run Shield E-commerce

## One-time setup

1. **Install dependencies**
   ```bash
   npm run install-all
   ```
   Or: `npm install` in root, then `npm install` in `server`, then `npm install` in `client`.

2. **MongoDB**  
   Have MongoDB running locally (e.g. `mongodb://localhost:27017`) or set `MONGODB_URI` in `server/.env`.

3. **Seed the database** (creates admin + sample data)
   ```bash
   cd server
   npm run seed
   ```
   **Admin login:** Open http://localhost:3000/admin/login and sign in with **admin@shield.com** / **admin123**

## Run the app (two terminals)

**Terminal 1 – backend**
```bash
cd server
npm run dev
```
→ API: http://localhost:5000

**Terminal 2 – frontend**
```bash
cd client
npm start
```
→ App: http://localhost:3000

## If port 5000 is already in use

On Windows PowerShell, free the port then start the server:
```powershell
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
cd server
npm run dev
```

## Optional: run both from root

If you have `concurrently` installed (`npm install` in root):
```bash
npm run dev
```
This starts both server and client; use two separate terminals if it fails on your machine.
