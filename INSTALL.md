# 🎯 COMPLETE INSTALLATION GUIDE
## Everything You Need to Install and Run

---

## 📋 WHAT YOU NEED TO DO (Simple Version)

### **1. Get API Keys & Database (10 minutes)**

#### A. OpenAI API Key (Required)
1. Go to: **https://platform.openai.com/api-keys**
2. Sign up (you get $5 free credit!)
3. Click "Create new secret key"
4. **Copy and save the key** (starts with `sk-...`)

#### B. Free Database (Railway - Recommended)
1. Go to: **https://railway.app**
2. Sign up with GitHub
3. Click "New Project" → "Provision PostgreSQL"
4. Wait 30 seconds
5. Click on PostgreSQL → "Variables" tab
6. **Copy the `DATABASE_URL`** (entire value)
7. Click "New" → "Provision Redis"  
8. Click on Redis → "Variables" tab
9. **Copy the `REDIS_URL`** (entire value)

---

### **2. Configure Environment (2 minutes)**

1. Open this file in Notepad:
   ```
   c:\llm_project\ai-workflow-agent\backend\.env
   ```

2. Find and replace these 3 lines:

   **Line 1 - OpenAI Key:**
   ```env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```
   Replace with your actual key from step 1A

   **Line 2 - Database:**
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/workflow_agent
   ```
   Replace with your Railway PostgreSQL URL from step 1B

   **Line 3 - Redis:**
   ```env
   REDIS_URL=redis://localhost:6379
   ```
   Replace with your Railway Redis URL from step 1B

3. **Save the file** (Ctrl+S)

---

### **3. Setup Database (1 minute)**

**Double-click:** `START.bat` in the project folder

Then:
- Press **1** (Setup Database)
- Wait for "migrations completed"
- Press **2** (Create Demo Data)
- Wait for "seeding completed"

---

### **4. Run the Application**

In the `START.bat` menu:
- Press **6** (Start ALL services)
- Wait 10 seconds
- Press **7** (Open in browser)

**OR** manually open 3 PowerShell windows:

**Window 1:**
```powershell
cd c:\llm_project\ai-workflow-agent\backend
npm run dev
```

**Window 2:**
```powershell
cd c:\llm_project\ai-workflow-agent\backend
npm run worker
```

**Window 3:**
```powershell
cd c:\llm_project\ai-workflow-agent\frontend
npm run dev
```

Then open: **http://localhost:5173**

---

### **5. Login & Test**

**Login credentials:**
- Email: `admin@example.com`
- Password: `password123`

**Test workflow:**
1. Click "Create Workflow"
2. Paste: `Every day at 9 AM, fetch https://api.github.com/users/octocat and email me a summary`
3. Click "Generate Workflow"
4. Click "Dry Run"
5. Click "Save"

---

## 🚀 EASIEST WAY TO RUN

### First Time Setup:
1. Get OpenAI key + Railway databases (10 min)
2. Edit `backend\.env` file (2 min)
3. Double-click `START.bat`
4. Press **1** then **2** (setup database)

### Every Time After:
1. Double-click `START.bat`
2. Press **6** (starts everything)
3. Press **7** (opens browser)

**Done!** 🎉

---

## 📁 HELPFUL FILES CREATED

| File | Purpose |
|------|---------|
| `START.bat` | **Easy menu to run everything** |
| `STEP_BY_STEP_SETUP.md` | Detailed setup instructions |
| `CHECKLIST.md` | Interactive checklist |
| `backend/start-backend.bat` | Start backend only |
| `backend/start-worker.bat` | Start worker only |
| `frontend/start-frontend.bat` | Start frontend only |

---

## 🎯 WHAT TO INSTALL

### Already Installed ✅
- Node.js
- Project files (60 files)
- All npm packages

### You Need to Get (Online - No Installation)
- OpenAI API key (free $5 credit)
- Railway PostgreSQL database (free)
- Railway Redis database (free)

### Total Cost
- **$0** for testing and learning
- OpenAI charges only when you use it (very cheap for testing)

---

## 🔧 WHAT EACH COMMAND DOES

```powershell
npm run dev          # Starts the backend API server
npm run worker       # Starts the workflow processor
npm run db:migrate   # Creates database tables
npm run db:seed      # Adds demo data
```

---

## 📊 ARCHITECTURE (Simple)

```
┌─────────────┐
│   Browser   │ ← You access this at localhost:5173
└──────┬──────┘
       │
┌──────▼──────┐
│  Frontend   │ ← React app (Terminal 3)
└──────┬──────┘
       │
┌──────▼──────┐
│  Backend    │ ← Express API (Terminal 1)
└──────┬──────┘
       │
┌──────▼──────┐
│   Worker    │ ← Processes workflows (Terminal 2)
└──────┬──────┘
       │
┌──────▼──────┐
│  Database   │ ← Railway PostgreSQL (cloud)
└─────────────┘
```

---

## ✅ SUCCESS CHECKLIST

- [ ] Got OpenAI API key
- [ ] Created Railway account
- [ ] Created PostgreSQL database on Railway
- [ ] Created Redis database on Railway
- [ ] Updated `backend\.env` with all 3 values
- [ ] Ran `npm run db:migrate` (success)
- [ ] Ran `npm run db:seed` (success)
- [ ] Started backend (Terminal 1 running)
- [ ] Started worker (Terminal 2 running)
- [ ] Started frontend (Terminal 3 running)
- [ ] Opened http://localhost:5173
- [ ] Logged in successfully
- [ ] Created a test workflow

**All checked?** You're done! 🎉

---

## 🆘 COMMON ISSUES

### "Cannot connect to database"
- Check `DATABASE_URL` in `.env` is correct
- Make sure you copied the ENTIRE URL from Railway
- Verify Railway database is running (green status)

### "Invalid OpenAI API key"
- Check the key starts with `sk-`
- No extra spaces before/after the key
- Verify you have credits: https://platform.openai.com/usage

### "Port already in use"
- Close other apps using port 3000 or 5173
- Or change `PORT=3001` in `.env`

### Frontend blank/white screen
- Make sure backend is running (Terminal 1)
- Check browser console (F12) for errors
- Try: http://localhost:5173 (not https)

---

## 📚 DOCUMENTATION

- `STEP_BY_STEP_SETUP.md` - Detailed guide
- `CHECKLIST.md` - Interactive checklist
- `docs/QUICKSTART.md` - Quick start guide
- `docs/api-reference.md` - API documentation
- `docs/example-workflows.md` - Example workflows
- `PROJECT_SUMMARY.md` - Complete overview

---

## 💡 TIPS

1. **Use START.bat** - It's the easiest way!
2. **Keep terminals open** - All 3 need to run
3. **Check logs** - Errors show in the terminal windows
4. **Test with Dry Run** - Before activating workflows
5. **Monitor OpenAI usage** - To control costs

---

## 🎊 NEXT STEPS

After setup:
1. ✅ Create your first workflow
2. ✅ Try the example workflows
3. ✅ Customize the UI colors
4. ✅ Add your own connectors
5. ✅ Deploy to production (see `docs/deployment.md`)

---

## 🚀 YOU'RE READY!

**Just follow the 5 steps at the top of this file.**

**Total time: ~15 minutes**

**Questions?** Check the docs or the troubleshooting section above.

---

**Happy Automating! 🎉**
