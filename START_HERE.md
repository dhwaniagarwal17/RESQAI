# 🎯 START HERE - RESQAI Setup Guide

Welcome to RESQAI! Follow these steps to get your AI-powered disaster response system running.

---

## ⚡ Quick Setup (5 Steps)

### Step 1: Configure ML Service (5 min)

```bash
cd ml-service

# Create virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

**Configure `.env` file:**
1. Get Gemini API Key: https://aistudio.google.com/app/apikey
2. Edit `ml-service/.env`:
   ```env
   GEMINI_API_KEY=your_key_here
   BERTWEET_MODEL_PATH=./models/bertweet_model
   ```

**Place Model Files:**
- Download your trained BERTweet model
- Place in: `ml-service/models/bertweet_model/`

### Step 2: Configure Backend (2 min)

```bash
cd backend

# Install dependencies
npm install

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Configure `.env` file:**
Edit `backend/.env`:
```env
JWT_SECRET=<paste_generated_secret>
MONGODB_URI=mongodb://localhost:27017/resqai
ML_SERVICE_URL=http://localhost:8000
```

### Step 3: Configure Frontend (1 min)

```bash
cd frontend

# Install dependencies
npm install
```

No `.env` needed for development!

### Step 4: Start MongoDB

**Windows:**
```bash
# Start as service (run as admin)
net start MongoDB
```

**Or use MongoDB Atlas** (cloud) - update `MONGODB_URI` in backend `.env`

### Step 5: Start All Services

**Option A: Use Script (Easiest)**
```bash
# From project root
start-all-services.bat
```

**Option B: Manual (3 Terminals)**

Terminal 1:
```bash
cd ml-service
venv\Scripts\activate
python -m app.main
```
✅ Wait for: "ML Service Ready!"

Terminal 2:
```bash
cd backend
npm run dev
```
✅ Wait for: "MongoDB Connected"

Terminal 3:
```bash
cd frontend
npm run dev
```
✅ Open: http://localhost:5173

---

## 🧪 Verify It Works

**Run Test:**
```bash
test-connection.bat
```

**Or Test Manually:**
```bash
# 1. ML Service
curl http://localhost:8000/health

# 2. Backend
curl http://localhost:5000/health

# 3. Frontend
# Open http://localhost:5173 in browser
```

---

## 🎉 You're Ready!

1. **Open Frontend:** http://localhost:5173
2. **Register/Login** with demo account:
   - Email: `citizen@resqai.demo`
   - Password: `Demo1234!`
3. **Submit Test Incident:**
   - "Building collapsed, people trapped, need urgent rescue"
4. **See AI Classification!** ✨

---

## 📚 Next Steps

| If You Want To... | Read This |
|-------------------|-----------|
| Quick start | `QUICK_START.md` ⭐ |
| Detailed setup | `SETUP_CHECKLIST.md` |
| Test ML connection | `TEST_ML_CONNECTION.md` |
| Fix issues | `TROUBLESHOOTING.md` |
| Understand integration | `INTEGRATION_COMPLETE.md` |
| API reference | `backend/README.md` |

---

## ⚠️ Important Notes

### Required Before Starting:
- ✅ Gemini API key configured
- ✅ BERTweet model files in place
- ✅ JWT secret generated
- ✅ MongoDB running

### Common Issues:
- **ML service won't start:** Check model files and API key
- **Backend can't connect:** Verify ML service is on port 8000
- **MongoDB error:** Start MongoDB service

### Need Help?
Run the test script: `test-connection.bat`

---

## 🎓 System Overview

```
Frontend (React) → Backend (Node.js) → ML Service (FastAPI)
                                            ↓
                                      BERTweet + Gemini
```

**What It Does:**
1. User submits disaster report
2. Backend sends to ML service
3. AI classifies message (category, urgency)
4. Backend saves with classification
5. Frontend displays classified incident

---

## 💡 Tips

- Keep all 3 terminals open while developing
- Check terminal logs for errors
- Use `monitor-ml.js` to watch ML service health
- Review documentation for specific issues

---

## 🚀 Ready to Build?

Your RESQAI system is fully integrated and ready for development!

**Happy Coding!** 🎊

*See `INTEGRATION_COMPLETE.md` for complete details*
