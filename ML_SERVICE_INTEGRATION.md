# RESQAI ML Service Integration Guide

This guide explains how to set up and integrate the ML service with the backend.

## Architecture Overview

```
┌─────────────────┐         ┌─────────────────┐         ┌──────────────────┐
│   Frontend      │ ───────>│   Backend       │ ───────>│   ML Service     │
│   (React)       │         │   (Node.js)     │         │   (FastAPI)      │
│   Port: 5173    │         │   Port: 5000    │         │   Port: 8000     │
└─────────────────┘         └─────────────────┘         └──────────────────┘
                                     │                           │
                                     │                           │
                                     v                           v
                            ┌─────────────┐           ┌──────────────────┐
                            │   MongoDB   │           │  BERTweet Model  │
                            │             │           │  + Gemini API    │
                            └─────────────┘           └──────────────────┘
```

## Quick Start

### Step 1: Set Up ML Service

#### 1.1 Navigate to ML Service Directory
```bash
cd ml-service
```

#### 1.2 Create Python Virtual Environment
```bash
python -m venv venv
```

#### 1.3 Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

#### 1.4 Install Dependencies
```bash
pip install -r requirements.txt
```

#### 1.5 Create Models Directory
```bash
mkdir models
mkdir models\bertweet_model
```

#### 1.6 Download Your Trained BERTweet Model

**If using Google Colab/Drive:**
1. In your Colab notebook, locate the saved model at `/content/drive/MyDrive/resqai_bertweet_final`
2. Download the following files:
   - `config.json`
   - `pytorch_model.bin` (or `model.safetensors`)
   - `vocab.txt`
   - `tokenizer_config.json`
   - `special_tokens_map.json`

3. Place them in `ml-service/models/bertweet_model/`

**Expected directory structure:**
```
ml-service/
├── models/
│   └── bertweet_model/
│       ├── config.json
│       ├── pytorch_model.bin
│       ├── vocab.txt
│       ├── tokenizer_config.json
│       └── special_tokens_map.json
├── app/
├── .env
└── requirements.txt
```

#### 1.7 Configure Environment Variables

The `.env` file has been created for you. **Update these values:**

1. **Get Gemini API Key:**
   - Visit: https://aistudio.google.com/app/apikey
   - Click "Create API Key"
   - Copy the key

2. **Edit `ml-service/.env`:**
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
BERTWEET_MODEL_PATH=./models/bertweet_model
```

#### 1.8 Start the ML Service
```bash
python -m app.main
```

You should see:
```
============================================================
RESQAI ML Service Starting...
============================================================

[1/2] Loading BERTweet model...
Device: cpu
Model path: ./models/bertweet_model
✓ BERTweet model loaded successfully

[2/2] Initializing Gemini service...
✓ Gemini service initialized

============================================================
ML Service Ready!
============================================================

INFO:     Uvicorn running on http://0.0.0.0:8000
```

#### 1.9 Test ML Service
Open a new terminal and test:

```bash
curl -X POST http://localhost:8000/classify -H "Content-Type: application/json" -d "{\"message\": \"We need urgent help, building collapsed\"}"
```

### Step 2: Set Up Backend

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Install Dependencies
```bash
npm install
```

#### 2.3 Configure Environment Variables

The `.env` file has been created. **Update these values:**

1. **Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

2. **Edit `backend/.env`:**
```env
# Update these:
JWT_SECRET=paste_generated_secret_here
MONGODB_URI=your_mongodb_connection_string

# ML Service URL (should work as is if ML service is running on port 8000)
ML_SERVICE_URL=http://localhost:8000
```

#### 2.4 Start MongoDB

**Option A - Local MongoDB:**
```bash
# Start MongoDB service
# Windows: MongoDB should auto-start as a service
# Linux: sudo systemctl start mongod
# Mac: brew services start mongodb-community
```

**Option B - MongoDB Atlas:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env`

#### 2.5 Start the Backend
```bash
npm run dev
```

You should see:
```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║             RESQAI Backend Server                     ║
║     AI-Assisted Disaster Response System              ║
║                                                       ║
║  Server running in development mode on port 5000      ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝

MongoDB Connected: localhost
```

### Step 3: Set Up Frontend

#### 3.1 Navigate to Frontend Directory
```bash
cd frontend
```

#### 3.2 Install Dependencies
```bash
npm install
```

#### 3.3 Start Frontend
```bash
npm run dev
```

The frontend will start on http://localhost:5173

## Testing the Complete Integration

### 1. Check Services Health

**ML Service:**
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "bertweet_loaded": true,
  "gemini_configured": true,
  "timestamp": 1234567890.123
}
```

**Backend:**
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "RESQAI Backend Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Test ML Classification via Backend

Register a user and submit an incident through the frontend, or test directly:

```bash
# First, register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "reporter"
  }'

# Then login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Use the token to submit an incident (replace YOUR_TOKEN)
curl -X POST http://localhost:5000/api/incidents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "message": "Building collapsed, people trapped inside, need immediate rescue",
    "location": {
      "type": "Point",
      "coordinates": [-122.4194, 37.7749],
      "address": "San Francisco, CA"
    }
  }'
```

## Classification Flow

1. **User submits incident** through frontend
2. **Backend receives request** → `/api/incidents`
3. **Backend calls ML service** → `mlService.classifyMessage(message)`
4. **ML Service processes:**
   - BERTweet predicts category + confidence
   - If confidence < 0.70 OR category = "not_humanitarian":
     - Gemini provides contextual analysis
   - Returns classification result
5. **Backend stores** incident with classification in MongoDB
6. **Frontend displays** classified incident with urgency, category, etc.

## Model Categories

The system classifies messages into 10 categories:

1. ⚠️ **caution_and_advice** - Safety warnings and guidance
2. 🏃 **displaced_people_and_evacuations** - Displacement and evacuation info
3. 🏢 **infrastructure_and_utility_damage** - Damage to buildings, roads, utilities
4. 🚑 **injured_or_dead_people** - Casualties and injuries
5. 🔍 **missing_or_found_people** - Missing persons reports
6. ❌ **not_humanitarian** - Non-disaster related content
7. ℹ️ **other_relevant_information** - General disaster information
8. 🆘 **requests_or_urgent_needs** - Urgent help requests
9. 🤝 **rescue_volunteering_or_donation_effort** - Aid and volunteer activities
10. 💙 **sympathy_and_support** - Condolences and emotional support

## Troubleshooting

### ML Service Issues

**Problem:** `Error loading BERTweet model: Model path not found`
**Solution:** 
- Verify model files are in `ml-service/models/bertweet_model/`
- Check `BERTWEET_MODEL_PATH` in `.env`

**Problem:** `GEMINI_API_KEY not found`
**Solution:**
- Add your Gemini API key to `ml-service/.env`
- Get key from https://aistudio.google.com/app/apikey

**Problem:** `Module not found` errors
**Solution:**
```bash
# Make sure virtual environment is activated
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Reinstall dependencies
pip install -r requirements.txt
```

### Backend Issues

**Problem:** `ML service is unavailable`
**Solution:**
- Ensure ML service is running on port 8000
- Check `ML_SERVICE_URL` in backend `.env`
- Test ML service health: `curl http://localhost:8000/health`

**Problem:** `MongoDB connection failed`
**Solution:**
- Start MongoDB service
- Verify `MONGODB_URI` in `.env`
- Check MongoDB logs

**Problem:** `JWT authentication failed`
**Solution:**
- Ensure `JWT_SECRET` is set in `.env`
- Generate a new secret: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

### Integration Issues

**Problem:** Classification not working end-to-end
**Solution:**
1. Check all services are running:
   - ML Service: http://localhost:8000/health
   - Backend: http://localhost:5000/health
   - Frontend: http://localhost:5173

2. Check browser console for errors
3. Check backend logs for ML service errors
4. Test ML service directly with curl

## Development Tips

### Running All Services

**Terminal 1 - ML Service:**
```bash
cd ml-service
venv\Scripts\activate
python -m app.main
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

### Hot Reload

- **ML Service:** Restart manually after code changes
- **Backend:** Auto-reloads with nodemon
- **Frontend:** Auto-reloads with Vite

### Testing Individual Components

**Test BERTweet only:**
```python
from app.services.bertweet_service import BertweetService

service = BertweetService()
service.load_model()
category, confidence = service.predict("We need urgent help")
print(f"Category: {category}, Confidence: {confidence:.2%}")
```

**Test Gemini only:**
```python
from app.services.gemini_service import GeminiService

service = GeminiService()
service.initialize()
result = service.analyze("Help needed", "other_relevant_information", 0.5)
print(result)
```

## Production Deployment

For production deployment:

1. **ML Service:**
   - Use Gunicorn with multiple workers
   - Set up proper logging
   - Use environment-specific config
   - Monitor GPU/CPU usage
   - Set up health check monitoring

2. **Backend:**
   - Set `NODE_ENV=production`
   - Use PM2 or similar process manager
   - Set up proper CORS origins
   - Enable rate limiting
   - Use MongoDB Atlas or managed database

3. **Security:**
   - Never commit `.env` files
   - Use strong JWT secrets
   - Rotate API keys regularly
   - Use HTTPS for all services
   - Set up firewall rules

## Support

For issues or questions:
1. Check logs in each service
2. Verify environment variables
3. Test services individually
4. Check network connectivity between services

## Environment Files Summary

### Backend `.env`
- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Authentication secret
- `ML_SERVICE_URL` - ML service endpoint

### ML Service `.env`
- `GEMINI_API_KEY` - Google Gemini API key
- `BERTWEET_MODEL_PATH` - Path to trained model

Both `.env` files are in `.gitignore` and won't be committed to version control. Use `.env.example` files as templates.
