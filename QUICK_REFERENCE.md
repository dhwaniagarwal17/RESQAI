# RESQAI Quick Reference Card

## 🚀 Start All Services

```bash
# Option 1: Use script (Windows)
start-all-services.bat

# Option 2: Manual (3 terminals)
# Terminal 1: ML Service
cd ml-service && venv\Scripts\activate && python -m app.main

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: Frontend
cd frontend && npm run dev
```

## 🧪 Test Connection

```bash
# Quick test
test-connection.bat

# Detailed test
cd backend && node test-ml.js

# Monitor ML service
cd backend && node monitor-ml.js
```

## 🌐 Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| ML Service | http://localhost:8000 |
| ML API Docs | http://localhost:8000/docs |

## 🔍 Health Checks

```bash
# ML Service
curl http://localhost:8000/health

# Backend
curl http://localhost:5000/health

# Test Classification
curl -X POST http://localhost:8000/classify -H "Content-Type: application/json" -d "{\"message\":\"Need help\"}"
```

## 📋 Required Files

### ML Service
- ✅ `.env` with `GEMINI_API_KEY`
- ✅ Model files in `models/bertweet_model/`

### Backend
- ✅ `.env` with `JWT_SECRET`, `MONGODB_URI`, `ML_SERVICE_URL`

### Frontend
- ✅ Dependencies installed (`npm install`)

## 🔧 Common Commands

```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Check if ports are in use (Windows)
netstat -ano | findstr :8000
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Kill process by PID
taskkill /PID <process_id> /F
```

## ⚡ Quick Fixes

| Issue | Solution |
|-------|----------|
| ML service won't start | Check model files, activate venv |
| Backend can't reach ML | Verify ML service running on :8000 |
| MongoDB connection error | Start MongoDB: `net start MongoDB` |
| Frontend 404 errors | Check backend is running on :5000 |

## 📚 Documentation

- **Setup:** `QUICK_START.md`
- **Testing:** `TEST_ML_CONNECTION.md`
- **Troubleshooting:** `TROUBLESHOOTING.md`
- **Complete Guide:** `INTEGRATION_COMPLETE.md`

## 🎯 Demo Credentials

```
Email: citizen@resqai.demo
Password: Demo1234!

Email: admin@resqai.demo
Password: Demo1234!

Email: alpha@resqai.demo (Rescue Team)
Password: Demo1234!
```

## 📞 Quick Support

1. Check terminal logs
2. Run `test-connection.bat`
3. Review `TROUBLESHOOTING.md`
4. Check `.env` files are configured
