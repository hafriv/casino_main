@echo off
cd backend
echo Installing dependencies...
call npm install
echo.
echo Starting backend server on port 3000...
call npm run dev
pause
