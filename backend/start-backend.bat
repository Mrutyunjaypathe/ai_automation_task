@echo off
echo ========================================
echo   AI Workflow Agent - Backend Server
echo ========================================
echo.
echo Starting backend API on port 3000...
echo.
cd /d "%~dp0"
npm run dev
