# RESQAI - Quick Start Guide

Get RESQAI up and running in minutes!

## 🚀 Prerequisites

- Node.js 16+ (`node --version`)
- Python 3.8+ (`python --version`)
- MongoDB (local or Atlas)

## 📦 One-Time Setup

### Step 1: ML Service (5-10 minutes)

```bash
cd ml-service

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create models directory
mkdir models
mkdir models\bertweet_model
```

**Download Your BERTweet Model:**
- Copy trained model files from Google Drive/Colab
- Place in `ml-service/models/bertweet_model/`
- Required files: `config.json`, `pytorch_model.bin`, `vocab.txt`, `tokenizer_config.json`, `special_tokens_map.json`

**Configure ML Service:**
```bash
# Edit ml-service/.env
GEMINI_API_KEY=your_api_key_from_https://aistudio.google.com/app/apikey
BERTWEET_MODEL_PATH=./models/bertweet_model
```

### Step 2: Backend (2-3 minutes)

```bash
cd backend

# Install dependencies
npm install

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Edit backend/.env
JWT_SECRET=<paste_generated_secret>
MONGODB_URI=mongodb://localhost:27017/resqai
ML_SERVICE_URL=http://localhost:8000
```

### Step 3: Frontend (2 minutes)

```bash
cd frontend

# Install dependencies
npm install
```

## ▶️ Running the Application

### Option A: Use Batch Script (Recommended for Windows)

```bash
# From project root
start-all-services.bat
```

This opens 3 terminal windows automatically!

### Option B: Manual Start (3 Terminals)

**Terminal 1 - ML Service:**
```bash
cd ml-service
venv\Scripts\activate
python -m app.main
```
✅ Wait for: "ML Service Ready!" 

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
✅ Wait for: "RESQAI Backend Server" + "MongoDB Connected"

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Wait for: "Local: http://localhost:5173"

## 🧪 Test Everything Works

### 1. Check Services Health

```bash
# ML Service
curl http://localhost:8000/health

# Backend
curl http://localhost:5000/health
```

### 2. Open Application

Browser → http://localhost:5173

### 3. Create Test User

1. Click "Get Started" or "Register"
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Role: Reporter
3. Submit

### 4. Submit Test Incident

1. Login with test credentials
2. Navigate to "Submit Incident"
3. Enter message:
   ```
   Building collapsed on Main Street. People trapped inside. Need urgent rescue.
   ```
4. Add location and submit
5. ✅ Verify AI classification appears!

## 🎯 Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | User interface |
| Backend | http://localhost:5000 | API server |
| ML Service | http://localhost:8000 | AI classification |

## 🔑 Environment Files Required

### `backend/.env`
```env
MONGODB_URI=mongodb://localhost:27017/resqai
JWT_SECRET=<your_generated_secret>
ML_SERVICE_URL=http://localhost:8000
```

### `ml-service/.env`
```env
GEMINI_API_KEY=<your_gemini_key>
BERTWEET_MODEL_PATH=./models/bertweet_model
```

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| ML service won't start | • Check model files in `models/bertweet_model/`<br>• Verify virtual environment activated<br>• Check Gemini API key |
| Backend can't connect to ML | • Verify ML service running on port 8000<br>• Test: `curl http://localhost:8000/health` |
| MongoDB connection error | • Start MongoDB: `mongod` (if local)<br>• Check connection string in backend/.env |
| JWT errors | • Verify JWT_SECRET is set in backend/.env<br>• Regenerate if needed |
| Frontend API errors | • Check backend is running on port 5000<br>• Open browser console for details |

## 📚 Detailed Documentation

- **Full Setup:** `ML_SERVICE_INTEGRATION.md`
- **Setup Checklist:** `SETUP_CHECKLIST.md`
- **Backend API:** `backend/README.md`
- **ML Service:** `ml-service/README.md`

## 🏗️ Project Structure

```
ResAI/
├── frontend/          # React + Vite
├── backend/           # Node.js + Express
├── ml-service/        # FastAPI + BERTweet + Gemini
├── Notebooks/         # Jupyter notebooks
└── Journals/          # Project documentation
```

## 🔐 Security Notes

- ⚠️ Never commit `.env` files
- ⚠️ Change JWT_SECRET in production
- ⚠️ Rotate API keys regularly
- ⚠️ Use HTTPS in production

## 📞 Need Help?

1. Check service logs in each terminal
2. Verify all environment variables set
3. Test each service individually
4. Review detailed docs: `ML_SERVICE_INTEGRATION.md`

## 🎉 You're All Set!

Once all services are running:
- **Frontend:** Create incidents and see AI classification
- **Backend:** Handles auth, data, and ML integration
- **ML Service:** Classifies messages with BERTweet + Gemini

Enjoy building with RESQAI! 🚁🆘
