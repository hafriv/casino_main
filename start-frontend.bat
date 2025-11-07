@echo off
cd frontend
echo Installing dependencies...
call npm install
echo.
echo Starting frontend dev server on port 5173...
call npm run dev
pause
