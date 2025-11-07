# Complete Setup Instructions

## Step 1: Ensure PostgreSQL is Running

Before starting the backend, PostgreSQL must be running on `localhost:5432`.

### Windows:
```bash
# Check if PostgreSQL service is running
pg_isready -h localhost -p 5432
```

If not running, open Windows Services and start PostgreSQL.

### Create Database (if not exists):
```bash
# Using psql
psql -U postgres

# In psql terminal:
CREATE DATABASE casino_db;
\q
```

## Step 2: Install Backend Dependencies

**Windows Command Prompt:**
```bash
cd backend
npm install
```

You should see npm installing:
- cors
- dotenv
- express
- pg
- ws (WebSocket package)

## Step 3: Start Backend Server

**Option A - Double-click batch file:**
```
start-backend.bat
```

**Option B - Manual start:**
```bash
cd backend
npm run dev
```

### Expected Output:
```
🔄 Connecting to PostgreSQL...
✅ Connected to PostgreSQL
✅ Database tables initialized

==================================================
🚀 Server running on http://localhost:3000
📡 WebSocket available at ws://localhost:3000
📊 Health check: http://localhost:3000/health
==================================================
```

## Step 4: Start Frontend Server (New Terminal)

**Option A - Double-click batch file:**
```
start-frontend.bat
```

**Option B - Manual start:**
```bash
cd frontend
npm install
npm run dev
```

### Expected Output:
```
VITE v7.1.2  ready in XXX ms

➜  Local:   http://localhost:5173/
```

## Step 5: Verify Everything Works

1. **Open Browser:** `http://localhost:5173`
2. **Login** with your account
3. **Go to Roulette** game page
4. **Open Developer Console** (F12)
5. **Check Console** for:
   - ✅ No WebSocket errors
   - ✅ No API 404 errors
   - ✅ Online players count shows

## Troubleshooting

### Error: "Cannot find module 'ws'"
```bash
# In backend directory:
npm install ws --save
npm run dev
```

### Error: "Connection refused" on port 3000
- Backend is not running
- Run: `npm run dev` in backend directory
- Check that Node.js v22+ is installed: `node --version`

### Error: "WebSocket connection refused"
- Backend server is not listening
- Verify backend console shows: "🚀 Server running on http://localhost:3000"
- Check firewall isn't blocking port 3000

### Error: "Database connection error"
- PostgreSQL not running
- Database `casino_db` doesn't exist
- Wrong credentials in `.env` file

### Error: API returns 404
- Vite proxy misconfigured (check vite.config.js)
- Backend endpoints not responding
- Try: `curl http://localhost:3000/health`

## Port Summary
- **Frontend Dev Server:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **WebSocket:** ws://localhost:3000
- **PostgreSQL:** localhost:5432

## File Structure
```
AI_slope/
├── backend/
│   ├── server.js (Main backend file)
│   ├── .env (Database credentials)
│   ├── package.json
│   └── node_modules/
├── frontend/
│   ├── src/
│   │   ├── pages/Roulette.jsx
│   │   ├── components/OnlinePlayers.jsx
│   │   └── App.css
│   ├── vite.config.js
│   ├── package.json
│   └── node_modules/
├── start-backend.bat
└── start-frontend.bat
```

## Quick Test Commands

```bash
# Test backend health
curl http://localhost:3000/health

# Test online players API
curl http://localhost:3000/api/players/online

# Test WebSocket (Windows PowerShell)
$ws = New-Object System.Net.WebSockets.ClientWebSocket
$uri = [uri]"ws://localhost:3000/?userId=1"
$ws.ConnectAsync($uri, [System.Threading.CancellationToken]::None).Wait()
$ws.State
```

## Next Steps
Once everything is running:
1. Place bets on the roulette table
2. Click "Spin" button
3. Watch the wheel spin and calculate winnings
4. Check real-time balance updates
5. View online players count updating
