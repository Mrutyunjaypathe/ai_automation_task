# 🚀 STEP-BY-STEP SETUP GUIDE
## Complete Installation & Running Instructions

Follow these steps **in order**. Total time: ~15 minutes.

---

## ✅ PREREQUISITES (Already Done!)

- ✅ Node.js installed
- ✅ Project files created (56 files)
- ✅ Frontend dependencies installed
- ✅ Backend dependencies installed

---

## 📝 STEP 1: Get OpenAI API Key (2 minutes)

1. Go to: https://platform.openai.com/api-keys
2. Sign up or log in
3. Click **"Create new secret key"**
4. Copy the key (starts with `sk-...`)
5. **Save it somewhere** - you'll need it in Step 3

💡 **Note:** You get $5 free credit with new accounts!

---

## 🗄️ STEP 2: Setup Free Cloud Database (5 minutes)

### Option A: Railway (Recommended - Easiest)

1. **Go to:** https://railway.app
2. **Click:** "Start a New Project"
3. **Sign up** with GitHub (free)
4. **Click:** "New Project" → "Provision PostgreSQL"
5. **Wait** for database to deploy (~30 seconds)
6. **Click** on the PostgreSQL service
7. **Go to:** "Variables" tab
8. **Copy** the `DATABASE_URL` value (looks like: `postgresql://postgres:...`)
9. **Click:** "New" → "Provision Redis"
10. **Wait** for Redis to deploy
11. **Click** on Redis service
12. **Go to:** "Variables" tab
13. **Copy** the `REDIS_URL` value (looks like: `redis://...`)

✅ **Done!** You now have free PostgreSQL + Redis databases!

---

## ⚙️ STEP 3: Configure Environment File (2 minutes)

1. **Open** the file: `c:\llm_project\ai-workflow-agent\backend\.env`
   - Use Notepad or any text editor

2. **Update these 3 lines:**

```env
# Replace this line:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/workflow_agent
# With your Railway PostgreSQL URL:
DATABASE_URL=postgresql://postgres:XXXXX@containers-us-west-XXX.railway.app:XXXX/railway

# Replace this line:
REDIS_URL=redis://localhost:6379
# With your Railway Redis URL:
REDIS_URL=redis://default:XXXXX@containers-us-west-XXX.railway.app:XXXX

# Replace this line:
OPENAI_API_KEY=sk-your-openai-api-key-here
# With your actual OpenAI key from Step 1:
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXX
```

3. **Save** the file (Ctrl+S)

✅ **Done!** Your environment is configured!

---

## 🗃️ STEP 4: Setup Database Tables (1 minute)

Open PowerShell and run:

```powershell
cd c:\llm_project\ai-workflow-agent\backend
npm run db:migrate
```

**Expected output:** "All migrations completed successfully"

Then create demo data:

```powershell
npm run db:seed
```

**Expected output:** "Database seeding completed"

✅ **Done!** Database is ready with demo user!

---

## 🚀 STEP 5: Run the Application (3 terminals needed)

### Terminal 1: Start Backend API

```powershell
cd c:\llm_project\ai-workflow-agent\backend
npm run dev
```

**Wait for:** "🚀 Server running on port 3000"

✅ **Keep this terminal running!**

---

### Terminal 2: Start Worker (New PowerShell window)

```powershell
cd c:\llm_project\ai-workflow-agent\backend
npm run worker
```

**Wait for:** "🔧 Workflow executor worker started"

✅ **Keep this terminal running!**

---

### Terminal 3: Start Frontend (New PowerShell window)

```powershell
cd c:\llm_project\ai-workflow-agent\frontend
npm run dev
```

**Wait for:** "Local: http://localhost:5173/"

✅ **Keep this terminal running!**

---

## 🎉 STEP 6: Access the Application

1. **Open your browser**
2. **Go to:** http://localhost:5173
3. **Login with:**
   - Email: `admin@example.com`
   - Password: `password123`

✅ **You're in!** 🎊

---

## 🎯 STEP 7: Test Your First Workflow

1. Click **"Create Workflow"**
2. Paste this example:
   ```
   Every day at 9 AM, fetch https://api.github.com/users/octocat 
   and email me a summary at test@example.com
   ```
3. Click **"Generate Workflow"**
4. Review the generated JSON
5. Click **"Dry Run"** to test
6. Click **"Save Workflow"**

✅ **Success!** You've created your first AI-powered workflow!

---

## 📋 QUICK REFERENCE

### To Start the App (After First Setup)

Just run these 3 commands in separate terminals:

```powershell
# Terminal 1
cd c:\llm_project\ai-workflow-agent\backend && npm run dev

# Terminal 2
cd c:\llm_project\ai-workflow-agent\backend && npm run worker

# Terminal 3
cd c:\llm_project\ai-workflow-agent\frontend && npm run dev
```

Then open: http://localhost:5173

---

## 🆘 TROUBLESHOOTING

### Error: "Cannot connect to database"
- ✅ Check your `DATABASE_URL` in `.env` is correct
- ✅ Make sure Railway database is running
- ✅ Check internet connection

### Error: "Invalid OpenAI API key"
- ✅ Verify your API key in `.env` starts with `sk-`
- ✅ Check you have credits at https://platform.openai.com/usage
- ✅ Make sure there are no extra spaces

### Error: "Port 3000 already in use"
- ✅ Close any other apps using port 3000
- ✅ Or change `PORT=3001` in `.env`

### Frontend shows blank page
- ✅ Make sure backend is running (Terminal 1)
- ✅ Check browser console for errors (F12)
- ✅ Try clearing browser cache

---

## 📚 WHAT'S NEXT?

- 📖 Read `docs/example-workflows.md` for more workflow ideas
- 🎨 Customize the UI colors in `frontend/tailwind.config.js`
- 🔌 Add more connectors in `backend/src/connectors/`
- 🚀 Deploy to production (see `docs/deployment.md`)

---

## 💡 TIPS

- **Save your work:** Workflows are saved in the database
- **Monitor logs:** Check the terminal windows for errors
- **Test first:** Always use "Dry Run" before activating workflows
- **API costs:** Monitor your OpenAI usage at https://platform.openai.com/usage

---

## 🎊 CONGRATULATIONS!

You now have a fully functional AI Workflow Agent running!

**Need help?** Check the documentation in the `docs/` folder.

---

**Happy Automating! 🚀**
