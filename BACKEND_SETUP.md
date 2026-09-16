# RESQAI Backend Setup Guide

Complete guide to set up and run the RESQAI backend system.

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         RESQAI System                         │
└──────────────────────────────────────────────────────────────┘

┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│             │  HTTP   │              │  HTTP   │             │
│  Frontend   │────────>│   Backend    │────────>│ ML Service  │
│  (Future)   │<────────│  (Node.js)   │<────────│  (Python)   │
│             │         │   Port 5000  │         │  Port 8000  │
└─────────────┘         └──────┬───────┘         └──────┬──────┘
                               │                        │
                               │ Mongoose               │ Load Model
                               v                        v
                        ┌─────────────┐         ┌──────────────┐
                        │   MongoDB   │         │   BERTweet   │
                        │  Database   │         │    Model     │
                        └─────────────┘         └──────┬───────┘
                                                       │
                                                       v
                                                ┌──────────────┐
                                                │    Gemini    │
                                                │   API Key    │
                                                └──────────────┘
```

## Prerequisites

Before starting, ensure you have:

### Required Software
- **Node.js 16+** - [Download](https://nodejs.org/)
- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/downloads)

### Required Resources
- **Trained BERTweet Model** - Your model from Google Drive (`/content/drive/MyDrive/resqai_bertweet_final`)
- **Gemini API Key** - Get from [Google AI Studio](https://aistudio.google.com/app/apikey)

## Step-by-Step Setup

### Step 1: Prepare Your ML Model

1. **Download your trained model from Google Drive**
   - Location: `/content/drive/MyDrive/resqai_bertweet_final`
   - Download all files in that directory

2. **Create models directory**
   ```bash
   cd ml-service
   mkdir models
   mkdir models\bertweet_model
   ```

3. **Copy model files**
   Place your downloaded model files in `ml-service/models/bertweet_model/`:
   ```
   ml-service/
   └── models/
       └── bertweet_model/
           ├── config.json
           ├── pytorch_model.bin
           ├── special_tokens_map.json
           ├── tokenizer_config.json
           └── vocab.txt
   ```

### Step 2: Set Up ML Service (Python)

1. **Navigate to ml-service**
   ```bash
   cd ml-service
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**
   
   **Windows:**
   ```bash
   venv\Scripts\activate
   ```
   
   **Linux/Mac:**
   ```bash
   source venv/bin/activate
   ```

4. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Create .env file**
   ```bash
   copy .env.example .env
   ```

6. **Configure .env**
   Edit `ml-service/.env`:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   BERTWEET_MODEL_PATH=./models/bertweet_model
   ```

7. **Start ML Service**
   ```bash
   python -m app.main
   ```
   
   You should see:
   ```
   ============================================================
   RESQAI ML Service Starting...
   ============================================================
   
   [1/2] Loading BERTweet model...
   ✓ BERTweet model loaded successfully
   
   [2/2] Initializing Gemini service...
   ✓ Gemini service initialized
   
   ============================================================
   ML Service Ready!
   ============================================================
   
   INFO: Uvicorn running on http://0.0.0.0:8000
   ```

8. **Test ML Service** (open new terminal)
   ```bash
   curl http://localhost:8000/health
   ```

### Step 3: Set Up Backend (Node.js)

1. **Open new terminal and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   copy .env.example .env
   ```

4. **Configure .env**
   Edit `backend/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # MongoDB - Local or Atlas
   MONGODB_URI=mongodb://localhost:27017/resqai
   
   # JWT Secret - CHANGE THIS!
   JWT_SECRET=change_this_to_a_very_secure_random_string_in_production
   JWT_EXPIRE=7d
   
   # ML Service URL
   ML_SERVICE_URL=http://localhost:8000
   
   # Gemini is configured in ml-service, not here
   
   # Confidence threshold for BERTweet
   CONFIDENCE_THRESHOLD=0.70
   ```

### Step 4: Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas**
1. Create free cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Update `MONGODB_URI` in backend/.env

### Step 5: Start Backend Server

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
║  Server running in development mode on port 5000     ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝

MongoDB Connected: localhost
```

### Step 6: Test the System

1. **Health Check**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Register a User**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register ^
     -H "Content-Type: application/json" ^
     -d "{\"name\":\"Test Reporter\",\"email\":\"reporter@test.com\",\"password\":\"test123\",\"role\":\"reporter\"}"
   ```

3. **Login**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login ^
     -H "Content-Type: application/json" ^
     -d "{\"email\":\"reporter@test.com\",\"password\":\"test123\"}"
   ```
   
   Copy the `token` from response.

4. **Create Test Incident**
   ```bash
   curl -X POST http://localhost:5000/api/incidents ^
     -H "Content-Type: application/json" ^
     -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
     -d "{\"message\":\"Building collapsed. People trapped. Need urgent rescue.\",\"location\":{\"latitude\":30.3398,\"longitude\":76.3869}}"
   ```

## Testing Classification Logic

### Test Case 1: High Confidence BERTweet
```bash
# Message: Clear request for help
# Expected: BERTweet only, no Gemini
curl -X POST http://localhost:5000/api/incidents ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -d "{\"message\":\"We urgently need water and medical supplies. People are injured.\"}"
```

Expected result:
- `modelUsed: "BERTweet"`
- `geminiUsed: false`
- `category: "requests_or_urgent_needs"`
- `confidence: >0.70`

### Test Case 2: Low Confidence
```bash
# Message: Ambiguous
# Expected: Gemini fallback
curl -X POST http://localhost:5000/api/incidents ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -d "{\"message\":\"Something happened near the old bridge earlier today.\"}"
```

Expected result:
- `modelUsed: "Gemini"`
- `geminiUsed: true`
- Additional fields: `urgency`, `humanitarian`, `explanation`

### Test Case 3: Not Humanitarian
```bash
# Message: Not disaster-related
# Expected: Gemini called even if high confidence
curl -X POST http://localhost:5000/api/incidents ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -d "{\"message\":\"Beautiful sunny day today! #weather\"}"
```

Expected result:
- `modelUsed: "Gemini"`
- `geminiUsed: true`
- `humanitarian: false`

## Port Summary

- **Backend (Node.js):** http://localhost:5000
- **ML Service (Python):** http://localhost:8000
- **MongoDB:** 27017 (default)

## Common Issues & Solutions

### ML Service Issues

**Issue:** `Model path not found`
```
Error: Model path not found: ./models/bertweet_model
```
**Solution:** Download your trained model and place it in `ml-service/models/bertweet_model/`

**Issue:** `GEMINI_API_KEY not found`
```
WARNING: GEMINI_API_KEY not found in environment variables
```
**Solution:** Add your Gemini API key to `ml-service/.env`

**Issue:** `ModuleNotFoundError: No module named 'transformers'`
```
ModuleNotFoundError: No module named 'transformers'
```
**Solution:** Activate venv and reinstall: `pip install -r requirements.txt`

### Backend Issues

**Issue:** `Cannot connect to MongoDB`
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB: `mongod` or use MongoDB Atlas

**Issue:** `ML service is unavailable`
```
ML service is unavailable. Please ensure the ML service is running.
```
**Solution:** Start ml-service first (port 8000)

**Issue:** `Not authorized. Invalid token.`
```
Not authorized. Invalid token.
```
**Solution:** Login again to get a fresh token

### Port Conflicts

**Issue:** `Port 5000 already in use`
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change `PORT` in backend/.env or kill process using port 5000

**Issue:** `Port 8000 already in use`
```
Error: [Errno 10048] Only one usage of each socket address
```
**Solution:** Kill process on port 8000 or change port in ml-service startup

## User Roles & Permissions

### Reporter
- Create incidents
- View own incidents
- Update own incident location/notes

### Admin
- View all incidents
- Filter and search incidents
- View statistics
- Assign rescue teams
- Update incident details
- Manage rescue teams

### Rescue Team
- View assigned incidents
- Update incident status
- Add field notes
- Mark incidents resolved

## Incident Status Flow

```
pending → assigned → accepted → en_route → on_site → resolved
```

- **pending:** Newly created, awaiting assignment
- **assigned:** Admin assigned to rescue team
- **accepted:** Rescue team accepted
- **en_route:** Team is traveling to location
- **on_site:** Team arrived at scene
- **resolved:** Incident completed

## Next Steps

1. **Test the complete flow:**
   - Register users with different roles
   - Create incidents as reporter
   - Assign incidents as admin
   - Update status as rescue team

2. **Build frontend:**
   - Frontend should only talk to backend (port 5000)
   - Backend handles ML service communication internally
   - Use JWT tokens for authentication

3. **Integrate with frontend:**
   - See API documentation in `backend/README.md`
   - All endpoints are RESTful
   - Use Authorization header with JWT token

4. **Deploy to production:**
   - See deployment guides in respective README files
   - Use environment variables for all secrets
   - Enable HTTPS
   - Use process managers (PM2 for Node, systemd for Python)

## Helpful Commands

### Backend
```bash
# Install dependencies
npm install

# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

### ML Service
```bash
# Activate venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Start service
python -m app.main
```

### MongoDB
```bash
# Start local MongoDB
mongod

# Connect to MongoDB shell
mongosh

# Show databases
show dbs

# Use RESQAI database
use resqai

# Show collections
show collections

# Query incidents
db.incidents.find().pretty()
```

## Support & Documentation

- **Backend API:** See `backend/README.md`
- **ML Service:** See `ml-service/README.md`
- **Main Project:** See root `README.md`

## Architecture Decisions

### Why Two Services?

1. **Language Separation:** ML (Python) vs Business Logic (Node.js)
2. **Independent Scaling:** Can scale ML service separately
3. **Model Isolation:** Model loading doesn't affect main API
4. **Technology Fit:** Python for ML, Node.js for web APIs

### Why Gemini Fallback?

1. **Safety:** Verify "not_humanitarian" classifications
2. **Context:** Handle ambiguous messages
3. **Enrichment:** Add urgency, location extraction
4. **Confidence:** Handle low-confidence predictions

### Why MongoDB?

1. **Flexible Schema:** Incident structure may evolve
2. **JSON Native:** Easy integration with Node.js
3. **Geospatial:** Future location-based queries
4. **Scalability:** Horizontal scaling for growth

## Security Checklist

- [ ] Changed JWT_SECRET in production
- [ ] Using MongoDB with authentication
- [ ] GEMINI_API_KEY kept secret
- [ ] HTTPS enabled in production
- [ ] Rate limiting configured
- [ ] Input validation enabled
- [ ] Error messages don't expose sensitive info
- [ ] Password hashing with bcrypt
- [ ] CORS configured properly

## Testing Checklist

- [ ] ML Service health check passes
- [ ] Backend health check passes
- [ ] User registration works
- [ ] User login returns token
- [ ] Create incident with high confidence
- [ ] Create incident with low confidence
- [ ] Test "not_humanitarian" fallback
- [ ] Admin can view all incidents
- [ ] Admin can assign rescue team
- [ ] Rescue team can update status

---

**You now have a fully functional RESQAI backend system!**

The ML model is integrated, classification is working, and the API is ready for frontend integration.
