# Quick Start Guide

## Prerequisites
- Node.js v22+ installed
- PostgreSQL running on localhost:5432
- Database `casino_db` created with user `postgres` password `1234`

## Option 1: Manual Start (Recommended for Debugging)

### Terminal 1 - Start Backend Server
```bash
cd backend
npm install
npm run dev
```

You should see:
```
🔄 Connecting to PostgreSQL...
✅ Connected to PostgreSQL
✅ Database tables initialized
🚀 Server running on http://localhost:3000
```

### Terminal 2 - Start Frontend Dev Server
```bash
cd frontend
npm install
npm run dev
```

You should see:
```
VITE v7.1.2  ready in XXX ms

➜  Local:   http://localhost:5173/
```

## Option 2: Concurrent Start (requires concurrently package)

From root directory:
```bash
npm install
npm run dev:all
```

## Testing Connection

1. Open browser to `http://localhost:5173`
2. Login with your account
3. Navigate to Roulette game
4. Check Console (F12) for:
   - ✅ WebSocket connection established
   - ✅ Online players count displayed
   - ✅ Real-time balance updates

## Troubleshooting

### WebSocket Connection Refused
- ✅ Backend server is running on port 3000
- ✅ No firewall blocking port 3000
- Check with: `netstat -an | findstr :3000` (Windows)

### API 404 Errors
- ✅ Backend is running on port 3000
- ✅ Vite proxy is configured correctly
- Check frontend console for actual request URL

### Database Connection Error
- ✅ PostgreSQL is running
- ✅ Database `casino_db` exists
- ✅ Credentials in `.env` are correct
  - PGUSER=postgres
  - PGPASSWORD=1234
  - PGHOST=localhost
  - PGPORT=5432
  - PGDATABASE=casino_db

## Port Configuration
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **WebSocket**: ws://localhost:3000
- **PostgreSQL**: localhost:5432
