@echo off
echo ========================================
echo   AI Workflow Agent - Worker Process
echo ========================================
echo.
echo Starting workflow worker...
echo.
cd /d "%~dp0"
npm run worker
