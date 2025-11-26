# ✅ SETUP CHECKLIST

Copy this checklist and check off items as you complete them:

---

## PART 1: PREREQUISITES ✅
- [x] Node.js installed
- [x] Project files created (56 files)
- [x] Frontend dependencies installed (`npm install` in frontend/)
- [x] Backend dependencies installed (`npm install` in backend/)

---

## PART 2: GET API KEYS & DATABASES

### OpenAI API Key (Required)
- [ ] Go to https://platform.openai.com/api-keys
- [ ] Create account / Login
- [ ] Click "Create new secret key"
- [ ] Copy the key (starts with `sk-...`)
- [ ] Save it in a safe place

### Database Setup (Choose ONE option)

#### OPTION A: Railway (Recommended - Free & Easy)
- [ ] Go to https://railway.app
- [ ] Sign up with GitHub
- [ ] Create new project
- [ ] Add PostgreSQL database
- [ ] Copy `DATABASE_URL` from Variables tab
- [ ] Add Redis database
- [ ] Copy `REDIS_URL` from Variables tab

#### OPTION B: Supabase (Alternative)
- [ ] Go to https://supabase.com
- [ ] Create account
- [ ] Create new project
- [ ] Go to Settings → Database
- [ ] Copy connection string

---

## PART 3: CONFIGURE ENVIRONMENT

- [ ] Open file: `backend\.env` in Notepad
- [ ] Replace `OPENAI_API_KEY=...` with your actual key
- [ ] Replace `DATABASE_URL=...` with your Railway/Supabase URL
- [ ] Replace `REDIS_URL=...` with your Railway Redis URL
- [ ] Save the file (Ctrl+S)

---

## PART 4: SETUP DATABASE

Open PowerShell in `backend/` folder and run:

- [ ] Run: `npm run db:migrate`
  - Expected: "All migrations completed successfully"
  
- [ ] Run: `npm run db:seed`
  - Expected: "Database seeding completed"

---

## PART 5: RUN THE APPLICATION

Open 3 separate PowerShell windows:

### Terminal 1: Backend API
- [ ] Run: `cd c:\llm_project\ai-workflow-agent\backend`
- [ ] Run: `npm run dev`
- [ ] Wait for: "🚀 Server running on port 3000"
- [ ] Keep this window open!

### Terminal 2: Worker
- [ ] Run: `cd c:\llm_project\ai-workflow-agent\backend`
- [ ] Run: `npm run worker`
- [ ] Wait for: "🔧 Workflow executor worker started"
- [ ] Keep this window open!

### Terminal 3: Frontend
- [ ] Run: `cd c:\llm_project\ai-workflow-agent\frontend`
- [ ] Run: `npm run dev`
- [ ] Wait for: "Local: http://localhost:5173/"
- [ ] Keep this window open!

---

## PART 6: TEST THE APPLICATION

- [ ] Open browser
- [ ] Go to: http://localhost:5173
- [ ] Login with:
  - Email: `admin@example.com`
  - Password: `password123`
- [ ] See the dashboard
- [ ] Click "Create Workflow"
- [ ] Test with example workflow

---

## 🎉 SUCCESS!

If all items are checked, your AI Workflow Agent is running!

---

## 📝 QUICK COMMANDS SUMMARY

```powershell
# Setup (one-time)
cd c:\llm_project\ai-workflow-agent\backend
npm run db:migrate
npm run db:seed

# Run (every time)
# Terminal 1:
cd c:\llm_project\ai-workflow-agent\backend
npm run dev

# Terminal 2:
cd c:\llm_project\ai-workflow-agent\backend
npm run worker

# Terminal 3:
cd c:\llm_project\ai-workflow-agent\frontend
npm run dev
```

Then open: **http://localhost:5173**

---

## 🆘 NEED HELP?

If you get stuck on any step:
1. Check the error message in the terminal
2. See TROUBLESHOOTING section in `STEP_BY_STEP_SETUP.md`
3. Make sure all 3 terminals are running
4. Verify your `.env` file has correct values

---

**Current Status:**
- ✅ Project created
- ✅ Dependencies installed
- ⏳ Waiting for you to complete the setup steps above

**Next:** Follow the checklist from top to bottom!
