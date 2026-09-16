# RESQAI - AI-Assisted Disaster Response System

## 🚨 Overview

RESQAI is a comprehensive AI-powered disaster response platform that classifies emergency messages and manages rescue operations through a complete backend system with machine learning integration.

---

## 👥 Team APEX

| Team Member | Roll Number |
|---|---|
| Dhwani Agarwal | 1024031024 |
| Sanchita Jain | 1024031020 |
| Yuvakshi Sood | 1024031025 |

**Department:** Computer Science  
**Institute:** Thapar Institute of Engineering and Technology

---

## 🎯 Problem Statement

During disasters (earthquakes, floods, hurricanes, wildfires), social media generates vast amounts of unstructured information:
- Emergency requests (food, water, medical aid)
- Casualty reports
- Missing person alerts
- Infrastructure damage
- Evacuation notices
- Rescue coordination
- Mixed with irrelevant content

**Challenge:** Manual classification is impossible at scale during rapidly evolving emergencies.

**Solution:** Automated AI-assisted classification + human oversight for rescue operations.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      RESQAI System                               │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│              │  HTTP   │              │  HTTP   │              │
│   Frontend   │────────>│   Backend    │────────>│ ML Service   │
│   (Future)   │<────────│   Node.js    │<────────│   Python     │
│              │         │  Port 5000   │         │  Port 8000   │
└──────────────┘         └──────┬───────┘         └──────┬───────┘
                                │                        │
                         ┌──────┴───────┐        ┌──────┴───────┐
                         │   MongoDB    │        │   BERTweet   │
                         │   Database   │        │    Model     │
                         └──────────────┘        └──────┬───────┘
                                                        │
                                                 ┌──────┴───────┐
                                                 │    Gemini    │
                                                 │   Fallback   │
                                                 └──────────────┘
```

---

## 🤖 AI Classification System

### Two-Stage Hybrid Approach

**Stage 1: BERTweet (Primary)**
- Fine-tuned transformer model for Twitter-style text
- Predicts 10 humanitarian categories
- Returns category + confidence score

**Stage 2: Gemini (Fallback)**
- Activated when:
  - Confidence < 0.70, OR
  - Category = "not_humanitarian"
- Provides contextual analysis (urgency, location, explanation)

### Classification Logic
```python
if confidence >= 0.70 and category != "not_humanitarian":
    return BERTweet_result
else:
    return Gemini_contextual_analysis
```

### 10 Humanitarian Categories
1. caution_and_advice
2. displaced_people_and_evacuations
3. infrastructure_and_utility_damage
4. injured_or_dead_people
5. missing_or_found_people
6. not_humanitarian
7. other_relevant_information
8. requests_or_urgent_needs
9. rescue_volunteering_or_donation_effort
10. sympathy_and_support

---

## 🎨 Project Structure

```
RESQAI/
│
├── backend/                    # Node.js + Express Backend
│   ├── controllers/           # Request handlers
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API endpoints
│   ├── services/              # Business logic + ML integration
│   ├── middleware/            # Auth & validation
│   ├── server.js              # Entry point
│   └── README.md              # Backend docs
│
├── ml-service/                # Python FastAPI ML Service
│   ├── app/
│   │   ├── services/
│   │   │   ├── bertweet_service.py    # Model inference
│   │   │   └── gemini_service.py      # Gemini integration
│   │   └── main.py            # FastAPI app
│   ├── models/                # ⚠️ Place trained model here
│   │   └── bertweet_model/
│   └── README.md              # ML service docs
│
├── Notebooks/                 # ML training notebooks
│   └── Model Final/
│       ├── RESQAI_Hybrid_Model.ipynb
│       └── RESQAI_Demo.ipynb
│
├── Proposal/                  # Project proposal
├── Report/                    # Project reports
│
├── BACKEND_SETUP.md          # 📖 Setup instructions
├── API_EXAMPLES.md           # 📖 API testing guide
├── PROJECT_SUMMARY.md        # 📖 Implementation summary
└── README.md                 # 📖 This file
```

---

## ✨ Features

### Backend System
- ✅ RESTful API with Express.js
- ✅ JWT authentication
- ✅ Role-based access control (Reporter/Admin/Rescue Team)
- ✅ MongoDB database with Mongoose
- ✅ ML service integration
- ✅ Incident lifecycle management
- ✅ Rescue team assignment
- ✅ Status tracking with history

### ML Integration
- ✅ BERTweet model inference
- ✅ Gemini fallback for uncertain cases
- ✅ Confidence-based routing
- ✅ Category classification
- ✅ Urgency detection
- ✅ Location extraction

### Security
- ✅ Password hashing (bcrypt)
- ✅ JWT tokens
- ✅ Input validation
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Helmet security headers

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Python 3.8+
- MongoDB
- Trained BERTweet model
- Gemini API key

### Installation

**1. Backend Setup**
```bash
cd backend
npm install
copy .env.example .env
# Edit .env with your configuration
npm run dev
```

**2. ML Service Setup**
```bash
cd ml-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# Edit .env with Gemini API key
# Add trained model to models/bertweet_model/
python -m app.main
```

**3. Start MongoDB**
```bash
mongod
```

### Test the System
```bash
# Health checks
curl http://localhost:5000/health
curl http://localhost:8000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123","role":"reporter"}'
```

**Full setup guide:** See `BACKEND_SETUP.md`

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Incidents (Reporter)
- `POST /api/incidents` - Create incident (auto-classified)
- `GET /api/incidents/my` - Get my incidents
- `GET /api/incidents/:id` - Get incident details
- `PATCH /api/incidents/:id` - Update incident

### Admin
- `GET /api/admin/incidents` - View all incidents (with filters)
- `GET /api/admin/incidents/stats` - Get statistics
- `POST /api/admin/incidents/:id/assign` - Assign to rescue team
- `PATCH /api/admin/incidents/:id` - Update incident details

### Rescue Team
- `GET /api/rescue/incidents` - Get assigned incidents
- `PATCH /api/rescue/incidents/:id/status` - Update status
- `POST /api/rescue/incidents/:id/notes` - Add field notes

**Full API documentation:** See `API_EXAMPLES.md`

---

## 🔄 Incident Workflow

```
1. Reporter Submits Message
         ↓
2. ML Classification (BERTweet + Gemini)
         ↓
3. Saved to Database (Status: pending)
         ↓
4. Admin Reviews & Assigns Rescue Team
         ↓
5. Status: assigned
         ↓
6. Rescue Team Accepts
         ↓
7. Status: accepted → en_route → on_site
         ↓
8. Rescue Team Resolves
         ↓
9. Status: resolved
```

---

## 🧪 Testing

See `API_EXAMPLES.md` for complete testing examples.

**Test Classification:**
```bash
# High confidence (BERTweet only)
curl -X POST http://localhost:5000/api/incidents \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Urgent! Need water and medical supplies."}'

# Low confidence (Gemini fallback)
curl -X POST http://localhost:5000/api/incidents \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Something happened near the bridge."}'
```

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| `BACKEND_SETUP.md` | Complete setup & installation guide |
| `API_EXAMPLES.md` | API testing examples with curl |
| `PROJECT_SUMMARY.md` | Implementation overview |
| `backend/README.md` | Backend architecture details |
| `ml-service/README.md` | ML service documentation |

---

## ⚙️ Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resqai
JWT_SECRET=your_secure_secret
JWT_EXPIRE=7d
ML_SERVICE_URL=http://localhost:8000
CONFIDENCE_THRESHOLD=0.70
```

### ML Service (.env)
```env
GEMINI_API_KEY=your_gemini_api_key
BERTWEET_MODEL_PATH=./models/bertweet_model
```

---

## 🛠️ Technology Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcrypt for password hashing
- axios for HTTP requests

**ML Service:**
- Python + FastAPI
- PyTorch + Transformers
- Google Gemini API
- Pydantic for validation

**Model:**
- BERTweet (vinai/bertweet-base)
- Fine-tuned on humanitarian disaster dataset
- 10-class classification

---

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Input validation
- Rate limiting
- CORS protection
- Helmet security headers
- Environment variable configuration

---

## 🎯 Key Design Decisions

**Why Two Services?**
- Separation of concerns (ML vs Business Logic)
- Language optimization (Python for ML, Node.js for API)
- Independent scaling

**Why Gemini Fallback?**
- Verify uncertain predictions
- Handle ambiguous messages
- Extract contextual information
- Safety check for "not_humanitarian"

**Why MongoDB?**
- Flexible schema for evolving incident structure
- JSON-native for Node.js
- Geospatial queries for future features

---

## 🚧 Troubleshooting

**ML Service Issues:**
- Model not found → Add model to `ml-service/models/bertweet_model/`
- Gemini error → Check API key in `.env`
- Import errors → `pip install -r requirements.txt`

**Backend Issues:**
- MongoDB connection → Start MongoDB or use Atlas
- ML service unavailable → Start ml-service first
- Auth errors → Check JWT_SECRET in `.env`

See `BACKEND_SETUP.md` for detailed troubleshooting.

---

## 🎓 Model Information

**BERTweet Model:**
- Base: `vinai/bertweet-base`
- Training: Custom fine-tuned on humanitarian disaster dataset
- Output: 10 humanitarian categories
- Format: PyTorch model with HuggingFace Transformers

**Model Location:**
- Training notebooks: `Notebooks/Model Final/`
- Deployed model: `ml-service/models/bertweet_model/`
- Original location: Google Drive (`/content/drive/MyDrive/resqai_bertweet_final`)

---

## 📊 Statistics & Performance

The system tracks:
- Total incidents
- Incidents by category
- Incidents by urgency
- Model usage (BERTweet vs Gemini)
- Response times
- Status distribution

Access via: `GET /api/admin/incidents/stats`

---

## 🔜 Future Enhancements

- [ ] Frontend web application
- [ ] Real-time notifications
- [ ] Map visualization
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] SMS/WhatsApp integration
- [ ] Automated resource allocation

---

## 📝 License

This project was developed as part of academic coursework at Thapar Institute of Engineering and Technology.

---

## 🙏 Acknowledgments

- **vinai/bertweet-base** - Base model for fine-tuning
- **Google Gemini** - Contextual analysis API
- **HuggingFace Transformers** - ML infrastructure
- **Thapar Institute** - Academic support

---

## 📞 Support

For issues, questions, or contributions:
1. Review documentation in respective folders
2. Check troubleshooting section
3. Verify configuration files
4. Test services independently

---

## ✅ Status

**Current Status:** ✅ COMPLETE & PRODUCTION-READY

- ✅ Backend API fully implemented
- ✅ ML service operational
- ✅ Database schema designed
- ✅ Authentication working
- ✅ Classification logic verified
- ✅ Documentation complete
- ⏳ Frontend pending

**Ready for:**
- Frontend integration
- Production deployment
- Further testing
- Feature expansion

---

**Built with ❤️ by Team APEX**
