# RESQAI - AI-Assisted Disaster Response System

> Intelligent classification and management of disaster-related information using hybrid AI models (BERTweet + Gemini).

![RESQAI Architecture](https://img.shields.io/badge/Stack-MERN%20%2B%20Python-blue)
![Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Overview

RESQAI is a comprehensive disaster response platform that leverages AI to automatically classify and prioritize emergency messages from social media and other sources. The system uses a hybrid approach combining BERTweet (fine-tuned transformer) with Google Gemini for contextual analysis.

### Key Features

- 🤖 **Hybrid AI Classification** - BERTweet + Gemini fallback for high accuracy
- 📊 **10-Category Classification** - Precise categorization of disaster messages
- 🚨 **Urgency Detection** - Automatic urgency level assignment (LOW/MEDIUM/HIGH)
- 👥 **Role-Based Access** - Reporter, Rescue Team, Admin roles
- 🗺️ **Location Tracking** - Geospatial incident mapping
- 📈 **Real-time Dashboard** - Live statistics and incident monitoring
- 🔐 **Secure Authentication** - JWT-based auth with role management

## 🏗️ Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌──────────────────┐
│   Frontend      │ ───────>│   Backend       │ ───────>│   ML Service     │
│   React + Vite  │  REST   │   Node.js       │  HTTP   │   FastAPI        │
│   Port: 5173    │<────────│   Express       │<────────│   Port: 8000     │
└─────────────────┘         │   Port: 5000    │         └──────────────────┘
                            └─────────────────┘                  │
                                     │                           │
                                     v                           v
                            ┌─────────────┐           ┌──────────────────┐
                            │   MongoDB   │           │  BERTweet Model  │
                            │   Database  │           │  + Gemini API    │
                            └─────────────┘           └──────────────────┘
```

## 📂 Project Structure

```
ResAI/
├── 📱 frontend/              React frontend application
│   ├── src/
│   │   ├── components/      Reusable UI components
│   │   ├── pages/           Page components (Landing, Dashboard, etc.)
│   │   ├── context/         Auth context
│   │   └── services/        API client
│   └── package.json
│
├── 🔧 backend/              Node.js + Express backend
│   ├── config/              Database configuration
│   ├── controllers/         Route handlers
│   ├── middleware/          Auth, roles, error handling
│   ├── models/              MongoDB schemas
│   ├── routes/              API endpoints
│   ├── services/            Business logic & ML client
│   ├── .env                 Environment variables
│   └── server.js            App entry point
│
├── 🤖 ml-service/           Python ML inference service
│   ├── app/
│   │   ├── services/
│   │   │   ├── bertweet_service.py    BERTweet classifier
│   │   │   └── gemini_service.py      Gemini fallback
│   │   └── main.py                     FastAPI app
│   ├── models/              Trained model files
│   ├── .env                 ML service config
│   └── requirements.txt
│
├── 📓 Notebooks/            Jupyter notebooks for model training
│   ├── Model Final/         Final BERTweet model
│   └── Other Models trial/  Experimental models
│
├── 📄 Documentation/
│   ├── QUICK_START.md       ⭐ Start here!
│   ├── SETUP_CHECKLIST.md   Complete setup guide
│   ├── ML_SERVICE_INTEGRATION.md  Detailed integration docs
│   └── API_EXAMPLES.md      API usage examples
│
└── 🚀 start-all-services.bat   Quick launch script (Windows)
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **Python** 3.8+ ([Download](https://www.python.org/))
- **MongoDB** ([Download](https://www.mongodb.com/try/download/community) or use [Atlas](https://www.mongodb.com/cloud/atlas))
- **Gemini API Key** ([Get here](https://aistudio.google.com/app/apikey))

### Installation (First Time Only)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ResAI
   ```

2. **Set up ML Service**
   ```bash
   cd ml-service
   python -m venv venv
   venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   ```
   
   - Place trained BERTweet model in `ml-service/models/bertweet_model/`
   - Edit `ml-service/.env` and add your Gemini API key

3. **Set up Backend**
   ```bash
   cd backend
   npm install
   ```
   
   - Generate JWT secret: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
   - Edit `backend/.env` and set `JWT_SECRET` and `MONGODB_URI`

4. **Set up Frontend**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

**Option A: Use Quick Start Script (Windows)**
```bash
start-all-services.bat
```

**Option B: Manual Start (3 terminals)**

Terminal 1:
```bash
cd ml-service
venv\Scripts\activate
python -m app.main
```

Terminal 2:
```bash
cd backend
npm run dev
```

Terminal 3:
```bash
cd frontend
npm run dev
```

### Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **ML Service:** http://localhost:8000

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get started in minutes ⭐
- **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** - Comprehensive setup checklist
- **[ML_SERVICE_INTEGRATION.md](ML_SERVICE_INTEGRATION.md)** - Detailed integration guide
- **[backend/README.md](backend/README.md)** - Backend API documentation
- **[ml-service/README.md](ml-service/README.md)** - ML service documentation

## 🎓 How It Works

### Classification Flow

1. **User submits disaster message** through the frontend
2. **Backend receives message** and forwards to ML service
3. **ML Service classifies:**
   - **BERTweet** predicts category + confidence score
   - **Decision:** If confidence ≥ 70% AND category ≠ "not_humanitarian"
     - ✅ Use BERTweet prediction
   - **Else:**
     - 🔄 Fall back to Gemini for contextual analysis
4. **Backend stores** classified incident in MongoDB
5. **Frontend displays** incident with category, urgency, and details

### Message Categories (10 Total)

1. 🆘 **requests_or_urgent_needs** - Urgent help requests
2. 🏃 **displaced_people_and_evacuations** - Displacement info
3. 🏢 **infrastructure_and_utility_damage** - Infrastructure damage
4. 🚑 **injured_or_dead_people** - Casualties
5. 🔍 **missing_or_found_people** - Missing persons
6. ⚠️ **caution_and_advice** - Safety warnings
7. 🤝 **rescue_volunteering_or_donation_effort** - Aid efforts
8. 💙 **sympathy_and_support** - Emotional support
9. ℹ️ **other_relevant_information** - General disaster info
10. ❌ **not_humanitarian** - Non-disaster content

## 👥 User Roles

### Reporter
- Submit new incidents
- View own incidents
- Track incident status

### Rescue Team
- View assigned incidents
- Update incident status
- Add operational notes

### Admin
- View all incidents
- Assign incidents to rescue teams
- Access statistics dashboard
- Manage system

## 🔧 Technology Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

### ML Service
- **FastAPI** - API framework
- **PyTorch** - ML framework
- **Transformers** - BERTweet model
- **Google Generative AI** - Gemini integration

## 🔐 Security Features

- 🔒 JWT-based authentication
- 🔑 Password hashing with bcrypt
- 🛡️ Role-based access control
- 🚦 Rate limiting
- 🔐 Helmet security headers
- ✅ Input validation
- 🌐 CORS protection

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Incidents
- `POST /api/incidents` - Create incident (Reporter)
- `GET /api/incidents/my` - Get my incidents (Reporter)
- `GET /api/incidents/:id` - Get incident details

### Admin
- `GET /api/admin/incidents` - Get all incidents with filters
- `GET /api/admin/incidents/stats` - Get statistics
- `POST /api/admin/incidents/:id/assign` - Assign to rescue team

### Rescue Team
- `GET /api/rescue/incidents` - Get assigned incidents
- `PATCH /api/rescue/incidents/:id/status` - Update status

Full API documentation: [backend/README.md](backend/README.md)

## 🧪 Testing

### Test ML Service
```bash
curl -X POST http://localhost:8000/classify \
  -H "Content-Type: application/json" \
  -d '{"message": "Building collapsed, need urgent rescue"}'
```

### Test Backend
```bash
curl http://localhost:5000/health
```

### Test Full Integration
1. Open http://localhost:5173
2. Register a test user
3. Submit an incident
4. Verify AI classification appears

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| ML service won't start | • Check model files in `models/bertweet_model/`<br>• Verify Gemini API key<br>• Activate virtual environment |
| Backend can't reach ML | • Ensure ML service running on port 8000<br>• Check `ML_SERVICE_URL` in backend `.env` |
| MongoDB connection error | • Start MongoDB service<br>• Verify `MONGODB_URI` in `.env` |
| JWT authentication fails | • Check `JWT_SECRET` in backend `.env`<br>• Regenerate if needed |

See [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) for complete troubleshooting guide.

## 📈 Performance

- **BERTweet Classification:** ~100-500ms
- **Gemini Fallback:** ~1-3s (when needed)
- **Average Response Time:** <1s for high-confidence cases
- **Accuracy:** 85-90% (BERTweet), 90-95% (with Gemini fallback)

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Configure MongoDB Atlas
4. Set up HTTPS
5. Use process manager (PM2)
6. Configure proper CORS origins
7. Enable logging and monitoring

See deployment guides in respective service READMEs.

## 📝 Environment Variables

### Backend `.env`
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<secure_random_string>
ML_SERVICE_URL=http://localhost:8000
```

### ML Service `.env`
```env
GEMINI_API_KEY=<your_gemini_api_key>
BERTWEET_MODEL_PATH=./models/bertweet_model
```

**⚠️ Never commit `.env` files to version control!**

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Team

**Team APEX**
- AI/ML Development
- Full-stack Development
- System Architecture

## 🙏 Acknowledgments

- **BERTweet** - Pre-trained language model
- **Google Gemini** - Contextual AI analysis
- **HumAID Dataset** - Training data for disaster classification
- **FastAPI** - Modern Python web framework
- **React** - Frontend library

## 📧 Support

For questions or issues:
1. Check documentation files
2. Review service logs
3. Test individual services
4. Open an issue on GitHub

---

**⭐ Quick Links:**
- [Quick Start Guide](QUICK_START.md)
- [Setup Checklist](SETUP_CHECKLIST.md)
- [ML Integration Guide](ML_SERVICE_INTEGRATION.md)
- [API Documentation](backend/README.md)

**🎯 Get Started:** Run `start-all-services.bat` (Windows) or follow [QUICK_START.md](QUICK_START.md)
