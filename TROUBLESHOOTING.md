# RESQAI Troubleshooting Guide

Common issues and their solutions.

## 🔍 Quick Diagnosis

Run these commands to check service status:

```bash
# ML Service Health
curl http://localhost:8000/health

# Backend Health
curl http://localhost:5000/health

# Check ports in use (Windows)
netstat -ano | findstr :5000
netstat -ano | findstr :5173
netstat -ano | findstr :8000
```

---

## 🤖 ML Service Issues

### Issue: Model Not Loading

**Error:**
```
Error loading BERTweet model: [Errno 2] No such file or directory: './models/bertweet_model/config.json'
```

**Solutions:**
1. Verify model files exist:
   ```bash
   dir ml-service\models\bertweet_model
   ```
   
2. Required files:
   - `config.json`
   - `pytorch_model.bin` (or `model.safetensors`)
   - `vocab.txt`
   - `tokenizer_config.json`
   - `special_tokens_map.json`

3. Check `.env` file:
   ```env
   BERTWEET_MODEL_PATH=./models/bertweet_model
   ```

4. Re-download model from Google Drive/Colab if files are missing

### Issue: Gemini API Key Error

**Error:**
```
WARNING: GEMINI_API_KEY not found in environment variables
```

**Solutions:**
1. Check `.env` file in `ml-service/` directory exists
2. Verify API key is set:
   ```env
   GEMINI_API_KEY=your_actual_key_here
   ```
3. Get new API key: https://aistudio.google.com/app/apikey
4. Restart ML service after updating

### Issue: Virtual Environment Not Activated

**Error:**
```
ModuleNotFoundError: No module named 'fastapi'
```

**Solutions:**
1. Activate virtual environment:
   ```bash
   cd ml-service
   venv\Scripts\activate  # Windows
   ```
2. Verify activation - command prompt should show `(venv)`
3. Reinstall dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Issue: Port 8000 Already in Use

**Error:**
```
ERROR: [Errno 48] Address already in use
```

**Solutions:**
1. Find process using port 8000:
   ```bash
   netstat -ano | findstr :8000
   ```
2. Kill the process (replace PID):
   ```bash
   taskkill /PID <process_id> /F
   ```
3. Or change ML service port in `.env`:
   ```env
   ML_SERVICE_PORT=8001
   ```
   And update backend `.env`:
   ```env
   ML_SERVICE_URL=http://localhost:8001
   ```

### Issue: CUDA/GPU Warnings

**Warning:**
```
UserWarning: CUDA is not available, using CPU
```

**Solutions:**
- This is **normal** if you don't have a GPU
- The service will work fine on CPU (just slower)
- To use GPU: Install CUDA and PyTorch with GPU support
- For most cases, CPU is sufficient

### Issue: Slow Classification

**Symptom:** Classification takes 5+ seconds

**Solutions:**
1. First run is always slower (model loading)
2. Subsequent runs should be faster
3. Check if Gemini is being called (slower):
   - Review BERTweet confidence scores
   - Adjust `CONFIDENCE_THRESHOLD` in `.env`
4. Consider GPU if available
5. Check network connection (for Gemini API)

---

## 🔧 Backend Issues

### Issue: MongoDB Connection Failed

**Error:**
```
Error connecting to MongoDB: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**

**For Local MongoDB:**
1. Start MongoDB service:
   ```bash
   # Windows (run as admin)
   net start MongoDB
   
   # Or if installed without service
   mongod
   ```

2. Verify MongoDB is running:
   ```bash
   mongo --eval "db.version()"
   ```

**For MongoDB Atlas:**
1. Check connection string in `.env`
2. Verify network access in Atlas dashboard
3. Add your IP to IP whitelist
4. Check username/password in connection string
5. Test connection:
   ```bash
   mongo "<your_connection_string>"
   ```

### Issue: ML Service Unavailable

**Error:**
```
ML service is unavailable. Please ensure the ML service is running.
```

**Solutions:**
1. Verify ML service is running:
   ```bash
   curl http://localhost:8000/health
   ```

2. Check `ML_SERVICE_URL` in backend `.env`:
   ```env
   ML_SERVICE_URL=http://localhost:8000
   ```

3. Ensure no firewall blocking localhost:8000

4. Check ML service logs for errors

5. Restart ML service:
   ```bash
   cd ml-service
   venv\Scripts\activate
   python -m app.main
   ```

### Issue: JWT Authentication Errors

**Error:**
```
Not authorized. Invalid token.
```

**Solutions:**
1. Check `JWT_SECRET` is set in backend `.env`
2. Generate new secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
3. Update `.env` and restart backend
4. Login again to get new token
5. Ensure token format: `Bearer <token>`

### Issue: Port 5000 Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
1. Find and kill process:
   ```bash
   netstat -ano | findstr :5000
   taskkill /PID <process_id> /F
   ```

2. Or change backend port in `.env`:
   ```env
   PORT=5001
   ```
   And update frontend API URL accordingly

### Issue: CORS Errors

**Error (in browser console):**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**
1. Backend already has CORS enabled for all origins in development
2. If deploying, update CORS settings in `backend/server.js`
3. Verify frontend is calling correct backend URL
4. Check browser console for exact CORS error details

### Issue: Validation Errors

**Error:**
```
Error: Message must be at least 10 characters
```

**Solutions:**
1. Check request body matches validation rules
2. Review validation rules in `backend/utils/validation.js`
3. Ensure all required fields are provided
4. Check data types match schema

---

## 📱 Frontend Issues

### Issue: Cannot Connect to Backend

**Error (in browser console):**
```
Network Error
```

**Solutions:**
1. Verify backend is running:
   ```bash
   curl http://localhost:5000/health
   ```

2. Check API base URL in `frontend/src/services/api.js`

3. Open browser DevTools → Network tab to see failed requests

4. Verify CORS is enabled on backend

5. Check browser console for detailed error messages

### Issue: Login/Register Not Working

**Symptom:** Form submits but nothing happens

**Solutions:**
1. Open browser console (F12) for errors
2. Check Network tab for API response
3. Verify backend is responding:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"test123"}'
   ```
4. Check token is being saved to localStorage
5. Verify AuthContext is providing auth state

### Issue: Incident Not Showing Classification

**Symptom:** Incident created but no category/urgency

**Solutions:**
1. Check backend logs for ML service errors
2. Verify ML service is running and healthy
3. Check incident object in database for classification fields
4. Review backend console for classification response
5. Test ML service directly:
   ```bash
   curl -X POST http://localhost:8000/classify \
     -H "Content-Type: application/json" \
     -d '{"message":"Test urgent help needed"}'
   ```

### Issue: Port 5173 Already in Use

**Error:**
```
Port 5173 is in use, trying another one...
```

**Solutions:**
1. This is usually harmless - Vite will use next available port
2. Or kill the process:
   ```bash
   netstat -ano | findstr :5173
   taskkill /PID <process_id> /F
   ```

---

## 🔗 Integration Issues

### Issue: End-to-End Classification Not Working

**Symptom:** Can submit incident but classification is missing

**Debugging Steps:**

1. **Test ML Service Directly:**
   ```bash
   curl -X POST http://localhost:8000/classify \
     -H "Content-Type: application/json" \
     -d '{"message":"Urgent help needed"}'
   ```
   Expected: JSON response with classification

2. **Test Backend ML Client:**
   Check backend logs when incident is created
   Should see: "Classifying message..." or similar

3. **Check Database:**
   ```bash
   mongo
   > use resqai
   > db.incidents.findOne()
   ```
   Verify classification fields are present

4. **Check Frontend:**
   - Browser console for errors
   - Network tab for API responses
   - Verify incident object has classification data

### Issue: Gemini Always Being Called

**Symptom:** All classifications use Gemini (slower)

**Solutions:**
1. Check BERTweet confidence scores
2. May indicate model issues
3. Verify model was trained properly
4. Check `CONFIDENCE_THRESHOLD` (default: 0.70)
5. Review model's `id2label` mapping in `config.json`

### Issue: High Error Rate

**Symptom:** Many classification errors

**Solutions:**
1. Check ML service logs for patterns
2. Verify model files not corrupted
3. Test with known working messages
4. Check Gemini API quota/limits
5. Verify network connectivity
6. Review error logs in backend

---

## 💾 Database Issues

### Issue: Cannot See Incidents

**Symptom:** No incidents showing in dashboard

**Solutions:**
1. Check if incidents exist in database:
   ```bash
   mongo
   > use resqai
   > db.incidents.count()
   > db.incidents.find().pretty()
   ```

2. Verify user is authenticated (check token)

3. Check role-based filtering:
   - Reporters see only their incidents
   - Rescue teams see assigned incidents
   - Admins see all incidents

4. Check API endpoint is correct

5. Review browser Network tab for API response

### Issue: Duplicate Users

**Error:**
```
E11000 duplicate key error collection: resqai.users index: email_1
```

**Solutions:**
1. Email already registered
2. Try login instead of register
3. Use different email
4. Or reset database if testing:
   ```bash
   mongo
   > use resqai
   > db.users.drop()
   ```

---

## 🔄 Restart Procedures

### Restart ML Service

```bash
# Stop (Ctrl+C in terminal)
# Then restart:
cd ml-service
venv\Scripts\activate
python -m app.main
```

### Restart Backend

```bash
# Stop (Ctrl+C in terminal)
# Then restart:
cd backend
npm run dev
```

### Restart Frontend

```bash
# Stop (Ctrl+C in terminal)
# Then restart:
cd frontend
npm run dev
```

### Reset Everything

```bash
# Kill all related processes
taskkill /F /IM node.exe
taskkill /F /IM python.exe

# Clear logs and restart MongoDB
net stop MongoDB
net start MongoDB

# Restart services (see above)
```

---

## 🧹 Clean Install

If nothing works, try clean install:

### ML Service

```bash
cd ml-service
rmdir /s /q venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Backend

```bash
cd backend
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Frontend

```bash
cd frontend
rmdir /s /q node_modules
del package-lock.json
npm install
```

---

## 📝 Logging and Debugging

### Enable Verbose Logging

**Backend:**
Add to `backend/.env`:
```env
LOG_LEVEL=debug
```

**ML Service:**
Add to `ml-service/.env`:
```env
FASTMCP_LOG_LEVEL=DEBUG
```

### Check Logs

**Backend:** Console output in terminal

**ML Service:** Console output in terminal

**Frontend:** Browser console (F12)

**MongoDB:** Check MongoDB log files

### Debug Mode

**Backend:**
```bash
cd backend
node --inspect server.js
```

**Frontend:**
- Open browser DevTools
- React DevTools extension helpful

---

## 🆘 Still Having Issues?

1. **Check all services are running:**
   ```bash
   # Should return healthy
   curl http://localhost:8000/health
   curl http://localhost:5000/health
   # Should open app
   start http://localhost:5173
   ```

2. **Review logs in each terminal window**

3. **Test each service independently**

4. **Check environment variables are set**

5. **Verify all dependencies installed**

6. **Check firewall/antivirus settings**

7. **Try on different port if port conflicts**

8. **Review detailed docs:**
   - `ML_SERVICE_INTEGRATION.md`
   - `SETUP_CHECKLIST.md`
   - Service-specific READMEs

---

## 📋 Diagnostic Checklist

- [ ] ML Service: http://localhost:8000/health returns healthy
- [ ] Backend: http://localhost:5000/health returns healthy
- [ ] Frontend: http://localhost:5173 opens
- [ ] MongoDB: Connection successful
- [ ] ML model files present in correct location
- [ ] Environment variables set in all `.env` files
- [ ] Virtual environment activated (ML service)
- [ ] Dependencies installed (all services)
- [ ] Ports 5000, 5173, 8000 available
- [ ] No firewall blocking localhost
- [ ] Gemini API key valid and set
- [ ] JWT secret generated and set

If all checked and still having issues, review service logs carefully for specific error messages.
