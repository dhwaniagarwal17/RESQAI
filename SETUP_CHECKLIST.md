# RESQAI Setup Checklist

Use this checklist to ensure all components are properly configured.

## ✅ Prerequisites

- [ ] **Node.js** installed (v16 or higher)
  - Check: `node --version`
  
- [ ] **Python** installed (v3.8 or higher)
  - Check: `python --version`
  
- [ ] **MongoDB** installed or MongoDB Atlas account
  - Local: MongoDB running on port 27017
  - Cloud: MongoDB Atlas connection string ready
  
- [ ] **Git** installed (for version control)
  - Check: `git --version`

## ✅ ML Service Setup

- [ ] Navigate to `ml-service` directory
- [ ] Create virtual environment: `python -m venv venv`
- [ ] Activate virtual environment: `venv\Scripts\activate` (Windows)
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Create `models` directory: `mkdir models`
- [ ] Create `models\bertweet_model` directory
- [ ] Download trained BERTweet model files from Google Drive/Colab
- [ ] Place model files in `models\bertweet_model\`:
  - [ ] `config.json`
  - [ ] `pytorch_model.bin` (or `model.safetensors`)
  - [ ] `vocab.txt`
  - [ ] `tokenizer_config.json`
  - [ ] `special_tokens_map.json`
- [ ] Get Gemini API key from https://aistudio.google.com/app/apikey
- [ ] Update `.env` file with Gemini API key
- [ ] Verify model path in `.env`: `BERTWEET_MODEL_PATH=./models/bertweet_model`
- [ ] Start ML service: `python -m app.main`
- [ ] Test ML service: `curl http://localhost:8000/health`
- [ ] Verify response shows `bertweet_loaded: true` and `gemini_configured: true`

## ✅ Backend Setup

- [ ] Navigate to `backend` directory
- [ ] Install dependencies: `npm install`
- [ ] Generate JWT secret:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- [ ] Update `.env` file:
  - [ ] Set `JWT_SECRET` to generated value
  - [ ] Set `MONGODB_URI` to your MongoDB connection string
  - [ ] Verify `ML_SERVICE_URL=http://localhost:8000`
- [ ] Start MongoDB (if local)
- [ ] Start backend: `npm run dev`
- [ ] Test backend: `curl http://localhost:5000/health`
- [ ] Verify MongoDB connection message in console
- [ ] Verify no ML service connection errors

## ✅ Frontend Setup

- [ ] Navigate to `frontend` directory
- [ ] Install dependencies: `npm install`
- [ ] Verify API URL in `src/services/api.js` points to backend
- [ ] Start frontend: `npm run dev`
- [ ] Open browser to http://localhost:5173
- [ ] Verify frontend loads without errors

## ✅ Integration Testing

### Test 1: User Registration
- [ ] Open frontend at http://localhost:5173
- [ ] Click "Get Started" or "Register"
- [ ] Fill in registration form
- [ ] Submit registration
- [ ] Verify successful registration and redirect to dashboard

### Test 2: User Login
- [ ] Navigate to login page
- [ ] Enter registered credentials
- [ ] Submit login
- [ ] Verify successful login and token storage

### Test 3: Submit Incident (Reporter)
- [ ] Login as reporter user
- [ ] Navigate to "Submit Incident"
- [ ] Enter a test message: "Building collapsed, people trapped inside, need urgent help"
- [ ] Add location information
- [ ] Submit incident
- [ ] Verify ML classification appears (category, urgency)
- [ ] Verify incident is saved to database

### Test 4: View Incidents (Rescue Team)
- [ ] Register/login as rescue team member (role: rescue)
- [ ] Navigate to dashboard
- [ ] Verify incidents appear with classification details
- [ ] Click on an incident to view details
- [ ] Verify all classification fields are displayed

### Test 5: Admin Dashboard
- [ ] Register/login as admin (role: admin)
- [ ] Navigate to admin dashboard
- [ ] Verify statistics are displayed
- [ ] Verify all incidents are listed
- [ ] Test filtering by category/urgency/status

## ✅ ML Classification Verification

Test different message types:

### High Urgency Request
- [ ] Message: "Urgent! People trapped in collapsed building, need immediate rescue"
- [ ] Expected: Category = "requests_or_urgent_needs", Urgency = HIGH

### Infrastructure Damage
- [ ] Message: "Bridge on Highway 1 has collapsed due to earthquake"
- [ ] Expected: Category = "infrastructure_and_utility_damage"

### Missing Person
- [ ] Message: "Looking for my family member, last seen in downtown area"
- [ ] Expected: Category = "missing_or_found_people"

### Not Humanitarian
- [ ] Message: "What a beautiful day! Going to the beach"
- [ ] Expected: Category = "not_humanitarian"

### Low Confidence → Gemini Fallback
- [ ] Submit ambiguous messages
- [ ] Verify Gemini provides contextual analysis
- [ ] Check `gemini_used: true` in response

## ✅ Common Issues Checklist

### ML Service Not Starting
- [ ] Virtual environment activated
- [ ] All dependencies installed
- [ ] Model files in correct location
- [ ] Gemini API key valid
- [ ] Port 8000 not in use

### Backend Not Connecting to ML Service
- [ ] ML service running on port 8000
- [ ] `ML_SERVICE_URL` in backend .env correct
- [ ] No firewall blocking localhost:8000
- [ ] Test: `curl http://localhost:8000/health`

### MongoDB Connection Issues
- [ ] MongoDB service running (if local)
- [ ] Connection string correct in .env
- [ ] Network access configured (if Atlas)
- [ ] IP whitelist configured (if Atlas)

### JWT Authentication Errors
- [ ] `JWT_SECRET` set in backend .env
- [ ] Same secret used for sign and verify
- [ ] Token included in request headers
- [ ] Token format: `Bearer <token>`

### Classification Not Working
- [ ] All services running
- [ ] ML service health check passing
- [ ] Backend can reach ML service
- [ ] Check backend console for errors
- [ ] Check ML service console for errors

## ✅ Environment Variables Summary

### Backend `.env` (Required)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_generated_secret>
JWT_EXPIRE=7d
ML_SERVICE_URL=http://localhost:8000
CONFIDENCE_THRESHOLD=0.70
```

### ML Service `.env` (Required)
```env
GEMINI_API_KEY=<your_gemini_api_key>
BERTWEET_MODEL_PATH=./models/bertweet_model
ML_SERVICE_HOST=0.0.0.0
ML_SERVICE_PORT=8000
CONFIDENCE_THRESHOLD=0.70
```

## ✅ Security Checklist

- [ ] `.env` files in `.gitignore`
- [ ] Strong JWT secret generated
- [ ] Gemini API key kept secret
- [ ] MongoDB credentials secured
- [ ] CORS configured for production
- [ ] Rate limiting enabled
- [ ] Helmet security headers active

## ✅ Quick Start (After Setup)

Use the batch script to start all services at once:

```bash
start-all-services.bat
```

Or manually:

**Terminal 1:**
```bash
cd ml-service
venv\Scripts\activate
python -m app.main
```

**Terminal 2:**
```bash
cd backend
npm run dev
```

**Terminal 3:**
```bash
cd frontend
npm run dev
```

## ✅ Production Readiness

- [ ] All tests passing
- [ ] Environment variables documented
- [ ] Error handling tested
- [ ] Logging configured
- [ ] Performance tested
- [ ] Security review completed
- [ ] Backup strategy defined
- [ ] Deployment plan documented

## 📝 Notes

- Keep `.env` files secure and never commit them
- Use `.env.example` as templates for team members
- Document any custom configuration
- Update this checklist as project evolves

---

**Need Help?**
- Check `ML_SERVICE_INTEGRATION.md` for detailed setup instructions
- Review service README files
- Check console logs for errors
- Test each service individually before integration
