@echo off
color 0A
title AI Workflow Agent - Setup & Run Helper

:MENU
cls
echo ========================================
echo   AI WORKFLOW AGENT - SETUP HELPER
echo ========================================
echo.
echo What would you like to do?
echo.
echo [1] Setup Database (Run migrations)
echo [2] Create Demo Data (Seed database)
echo [3] Start Backend API
echo [4] Start Worker
echo [5] Start Frontend
echo [6] Start ALL (Backend + Worker + Frontend)
echo [7] Open Application in Browser
echo [8] View Setup Guide
echo [9] Exit
echo.
set /p choice="Enter your choice (1-9): "

if "%choice%"=="1" goto MIGRATE
if "%choice%"=="2" goto SEED
if "%choice%"=="3" goto BACKEND
if "%choice%"=="4" goto WORKER
if "%choice%"=="5" goto FRONTEND
if "%choice%"=="6" goto ALL
if "%choice%"=="7" goto BROWSER
if "%choice%"=="8" goto GUIDE
if "%choice%"=="9" goto EXIT
goto MENU

:MIGRATE
cls
echo ========================================
echo   Running Database Migrations
echo ========================================
echo.
cd backend
call npm run db:migrate
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:SEED
cls
echo ========================================
echo   Creating Demo Data
echo ========================================
echo.
cd backend
call npm run db:seed
echo.
echo Demo user created:
echo Email: admin@example.com
echo Password: password123
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:BACKEND
cls
echo ========================================
echo   Starting Backend API
echo ========================================
echo.
echo Backend will start on http://localhost:3000
echo Keep this window open!
echo.
cd backend
call npm run dev
pause
goto MENU

:WORKER
cls
echo ========================================
echo   Starting Worker Process
echo ========================================
echo.
echo Worker will process workflow jobs
echo Keep this window open!
echo.
cd backend
call npm run worker
pause
goto MENU

:FRONTEND
cls
echo ========================================
echo   Starting Frontend
echo ========================================
echo.
echo Frontend will start on http://localhost:5173
echo Keep this window open!
echo.
cd frontend
call npm run dev
pause
goto MENU

:ALL
cls
echo ========================================
echo   Starting All Services
echo ========================================
echo.
echo This will open 3 new windows:
echo 1. Backend API (port 3000)
echo 2. Worker Process
echo 3. Frontend (port 5173)
echo.
echo Press any key to continue...
pause >nul

start "Backend API" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 3 /nobreak >nul
start "Worker Process" cmd /k "cd /d %~dp0backend && npm run worker"
timeout /t 3 /nobreak >nul
start "Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo All services started in separate windows!
echo Wait 10 seconds, then press option [7] to open in browser
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:BROWSER
cls
echo ========================================
echo   Opening Application
echo ========================================
echo.
echo Opening http://localhost:5173 in your browser...
echo.
start http://localhost:5173
echo.
echo Login with:
echo Email: admin@example.com
echo Password: password123
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:GUIDE
cls
echo ========================================
echo   QUICK SETUP GUIDE
echo ========================================
echo.
echo FIRST TIME SETUP:
echo.
echo 1. Get OpenAI API Key from:
echo    https://platform.openai.com/api-keys
echo.
echo 2. Setup free database at:
echo    https://railway.app
echo    - Create PostgreSQL database
echo    - Create Redis database
echo.
echo 3. Edit backend\.env file:
echo    - Add your OPENAI_API_KEY
echo    - Add your DATABASE_URL
echo    - Add your REDIS_URL
echo.
echo 4. Run option [1] - Setup Database
echo 5. Run option [2] - Create Demo Data
echo 6. Run option [6] - Start ALL services
echo 7. Run option [7] - Open in browser
echo.
echo For detailed instructions, see:
echo - STEP_BY_STEP_SETUP.md
echo - CHECKLIST.md
echo.
echo Press any key to return to menu...
pause >nul
goto MENU

:EXIT
cls
echo.
echo Thank you for using AI Workflow Agent!
echo.
echo Documentation:
echo - STEP_BY_STEP_SETUP.md - Complete setup guide
echo - CHECKLIST.md - Setup checklist
echo - docs/ - Full documentation
echo.
timeout /t 3
exit

