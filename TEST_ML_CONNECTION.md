# Testing ML Service Connection with Backend

This guide will help you verify that the ML service is running and properly connected to the backend.

---

## ✅ Step-by-Step Verification

### Step 1: Start the ML Service

#### 1.1 Navigate to ML Service Directory
```bash
cd ml-service
```

#### 1.2 Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

You should see `(venv)` in your command prompt.

#### 1.3 Verify Dependencies Installed
```bash
pip list
```

Look for:
- `fastapi`
- `uvicorn`
- `torch`
- `transformers`
- `google-genai`

If missing, install:
```bash
pip install -r requirements.txt
```

#### 1.4 Check Environment Variables
```bash
# Windows
type .env

# Linux/Mac
cat .env
```

Verify:
- ✅ `GEMINI_API_KEY` is set
- ✅ `BERTWEET_MODEL_PATH=./models/bertweet_model`

#### 1.5 Verify Model Files Exist
```bash
# Windows
dir models\bertweet_model

# Linux/Mac
ls -la models/bertweet_model
```

Required files:
- ✅ `config.json`
- ✅ `pytorch_model.bin` (or `model.safetensors`)
- ✅ `vocab.txt`
- ✅ `tokenizer_config.json`
- ✅ `special_tokens_map.json`

#### 1.6 Start the ML Service
```bash
python -m app.main
```

**Expected Output:**
```
============================================================
RESQAI ML Service Starting...
============================================================

[1/2] Loading BERTweet model...
Device: cpu (or cuda if GPU available)
Model path: ./models/bertweet_model
Model loaded with 10 labels
Label mapping: {0: 'caution_and_advice', 1: 'displaced_people_and_evacuations', ...}
✓ BERTweet model loaded successfully

[2/2] Initializing Gemini service...
Gemini client initialized with model: gemini-2.0-flash-exp
✓ Gemini service initialized

============================================================
ML Service Ready!
============================================================

INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

**🚨 If you see errors:**
- **Model not found:** Check model path and files
- **Gemini API error:** Check API key in `.env`
- **Module errors:** Reinstall dependencies

---

### Step 2: Test ML Service Directly

Open a **NEW terminal** (keep ML service running) and test:

#### Test 1: Health Check
```bash
curl http://localhost:8000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "bertweet_loaded": true,
  "gemini_configured": true,
  "timestamp": 1234567890.123
}
```

✅ **Success:** Both `bertweet_loaded` and `gemini_configured` are `true`

❌ **If `bertweet_loaded` is false:**
- Check model files are in correct location
- Check ML service console for errors

❌ **If `gemini_configured` is false:**
- Check Gemini API key in `.env`
- Verify API key is valid

#### Test 2: Classification (High Confidence)
```bash
curl -X POST http://localhost:8000/classify \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Building collapsed on Main Street, people trapped inside, need urgent rescue\"}"
```

**Expected Response:**
```json
{
  "model_used": "BERTweet",
  "bertweet_prediction": "infrastructure_and_utility_damage",
  "bertweet_confidence": 0.87,
  "final_category": "infrastructure_and_utility_damage",
  "gemini_used": false
}
```

✅ **Success:** You get a classification response with high confidence

#### Test 3: Classification (Low Confidence - Gemini Fallback)
```bash
curl -X POST http://localhost:8000/classify \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Something happened near the bridge\"}"
```

**Expected Response:**
```json
{
  "model_used": "Gemini",
  "bertweet_prediction": "other_relevant_information",
  "bertweet_confidence": 0.52,
  "final_category": "other_relevant_information",
  "gemini_used": true,
  "humanitarian": false,
  "urgency": "LOW",
  "request_for_help": false,
  "location": "NONE",
  "explanation": "..."
}
```

✅ **Success:** Gemini provides additional context

---

### Step 3: Start the Backend

Open a **NEW terminal** and:

#### 3.1 Navigate to Backend
```bash
cd backend
```

#### 3.2 Check Environment Variables
```bash
# Windows
type .env

# Linux/Mac
cat .env
```

Verify:
- ✅ `ML_SERVICE_URL=http://localhost:8000`
- ✅ `MONGODB_URI` is set
- ✅ `JWT_SECRET` is set

#### 3.3 Start MongoDB (if local)
```bash
# Windows (run as admin)
net start MongoDB

# Or if MongoDB is not a service
mongod
```

#### 3.4 Start Backend
```bash
npm run dev
```

**Expected Output:**
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

✅ **Success:** Server is running and MongoDB is connected

---

### Step 4: Test Backend Health

Open a **NEW terminal** and test:

```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "RESQAI Backend Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

✅ **Success:** Backend is running

---

### Step 5: Test ML Service Connection via Backend

#### Test 1: Check ML Service from Backend

Add this test endpoint to your backend (optional):

Create `backend/test-ml.js`:
```javascript
const mlService = require('./services/mlService');

async function test() {
  console.log('Testing ML Service Connection...\n');
  
  // Test 1: Health Check
  console.log('1. Health Check:');
  try {
    const health = await mlService.healthCheck();
    console.log('✓ ML Service Health:', JSON.stringify(health, null, 2));
  } catch (error) {
    console.error('✗ Health check failed:', error.message);
    return;
  }

  // Test 2: Classification
  console.log('\n2. Classification Test:');
  try {
    const result = await mlService.classifyMessage(
      'Building collapsed, need urgent rescue'
    );
    console.log('✓ Classification Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('✗ Classification failed:', error.message);
  }
}

test();
```

Run the test:
```bash
node backend/test-ml.js
```

**Expected Output:**
```
Testing ML Service Connection...

1. Health Check:
✓ ML Service Health: {
  "status": "healthy",
  "bertweet_loaded": true,
  "gemini_configured": true,
  "timestamp": 1234567890.123
}

2. Classification Test:
✓ Classification Result: {
  "model_used": "BERTweet",
  "bertweet_prediction": "requests_or_urgent_needs",
  "bertweet_confidence": 0.89,
  "final_category": "requests_or_urgent_needs",
  "gemini_used": false,
  "processingTime": 234
}
```

✅ **Success:** Backend can communicate with ML service

---

### Step 6: Test End-to-End Integration

#### 6.1 Register a Test User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test User\",
    \"email\": \"test@example.com\",
    \"password\": \"Test123!\",
    \"role\": \"reporter\"
  }"
```

**Save the token from the response!**

#### 6.2 Submit an Incident (This tests ML integration)

```bash
curl -X POST http://localhost:5000/api/incidents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{
    \"message\": \"Building collapsed on Main Street. People trapped inside. Need immediate rescue and medical help.\",
    \"location\": {
      \"type\": \"Point\",
      \"coordinates\": [-122.4194, 37.7749],
      \"address\": \"Main Street, San Francisco, CA\"
    }
  }"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Incident created and classified successfully",
  "data": {
    "incident": {
      "_id": "...",
      "message": "Building collapsed...",
      "category": "infrastructure_and_utility_damage",
      "confidence": 0.87,
      "urgency": "HIGH",
      "humanitarian": true,
      "modelUsed": "BERTweet",
      "status": "pending",
      "reporter": "...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

✅ **Success:** Incident was classified by ML service and saved to database!

**Check ML service logs** - you should see:
```
INFO:     127.0.0.1:XXXXX - "POST /classify HTTP/1.1" 200 OK
```

**Check backend logs** - you should see classification details

---

## 🔍 Troubleshooting Connection Issues

### Issue 1: Backend Can't Reach ML Service

**Error:** `ML service is unavailable`

**Solutions:**

1. **Verify ML service is running:**
   ```bash
   curl http://localhost:8000/health
   ```
   - If this fails, ML service is not running
   - Restart ML service

2. **Check ML_SERVICE_URL in backend/.env:**
   ```bash
   type backend\.env | findstr ML_SERVICE_URL
   ```
   - Should be: `ML_SERVICE_URL=http://localhost:8000`

3. **Check firewall:**
   - Temporarily disable firewall to test
   - If it works, add exception for port 8000

4. **Check both services are on same network:**
   - Use `localhost` or `127.0.0.1`
   - Don't mix with external IPs

### Issue 2: Classification Takes Too Long

**Symptom:** Classification takes 30+ seconds or times out

**Solutions:**

1. **First request is slower (model loading):** Normal
2. **Check if Gemini is always being called:**
   - Review confidence scores
   - Adjust `CONFIDENCE_THRESHOLD` if needed
3. **Network issues with Gemini API:**
   - Check internet connection
   - Verify Gemini API quota

### Issue 3: Wrong Classifications

**Symptom:** Categories don't match message content

**Solutions:**

1. **Verify model files:**
   - Check `config.json` has correct label mapping
   - Ensure using the trained model (not base model)

2. **Check confidence threshold:**
   - Lower threshold = More BERTweet usage
   - Higher threshold = More Gemini fallback

---

## 📊 Monitoring Dashboard

Create a simple monitoring script `backend/monitor.js`:

```javascript
const mlService = require('./services/mlService');

async function monitor() {
  console.clear();
  console.log('═══════════════════════════════════════');
  console.log('  RESQAI ML Service Monitor');
  console.log('═══════════════════════════════════════\n');

  const health = await mlService.healthCheck();
  
  console.log('Status:', health.status === 'healthy' ? '✓ HEALTHY' : '✗ UNAVAILABLE');
  console.log('BERTweet:', health.bertweet_loaded ? '✓ Loaded' : '✗ Not loaded');
  console.log('Gemini:', health.gemini_configured ? '✓ Configured' : '✗ Not configured');
  console.log('\nRefreshing in 5 seconds... (Ctrl+C to stop)');
}

setInterval(monitor, 5000);
monitor();
```

Run:
```bash
node backend/monitor.js
```

---

## ✅ Connection Verification Checklist

- [ ] ML service starts without errors
- [ ] ML service health check returns `healthy`
- [ ] BERTweet model loads successfully
- [ ] Gemini is configured
- [ ] Direct classification via ML service works
- [ ] Backend starts without errors
- [ ] Backend health check returns success
- [ ] Backend can reach ML service
- [ ] Can submit incident through API
- [ ] Incident gets classified automatically
- [ ] Classification results saved to database

---

## 🎯 Quick Test Commands

**Test everything at once (Windows):**

```batch
@echo off
echo Testing ML Service Connection...
echo.

echo [1/5] Testing ML Service Health...
curl http://localhost:8000/health
echo.
echo.

echo [2/5] Testing ML Classification...
curl -X POST http://localhost:8000/classify -H "Content-Type: application/json" -d "{\"message\":\"Need urgent help\"}"
echo.
echo.

echo [3/5] Testing Backend Health...
curl http://localhost:5000/health
echo.
echo.

echo [4/5] All tests complete!
echo.
echo If all tests passed, services are connected properly!
pause
```

Save as `test-connection.bat` and run.

---

## 📞 Still Having Issues?

1. Check all three terminal windows for error messages
2. Verify ports 5000, 8000 are not used by other apps
3. Review logs in each service
4. Check `.env` files are correctly configured
5. Try restarting all services

**Service Order:**
1. Start ML Service first (port 8000)
2. Start Backend second (port 5000)
3. Start Frontend last (port 5173)

---

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ ML service console shows "ML Service Ready!"
2. ✅ Backend console shows "MongoDB Connected"
3. ✅ Health checks return 200 OK
4. ✅ Test incident gets classified
5. ✅ Classification appears in database
6. ✅ Frontend can submit incidents with AI classification

**The ML service is properly connected to the backend!** 🚀
