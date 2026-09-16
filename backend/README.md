# RESQAI Backend

Node.js + Express backend for the RESQAI disaster response system.

## Architecture Overview

```
┌─────────────┐      HTTP      ┌──────────────┐      HTTP       ┌─────────────┐
│             │────────────────>│              │───────────────>│             │
│  Frontend   │                 │   Node.js    │                 │  ML Service │
│             │<────────────────│   Backend    │<───────────────│  (FastAPI)  │
└─────────────┘                 └──────────────┘                 └─────────────┘
                                       │
                                       │ Mongoose
                                       v
                                ┌─────────────┐
                                │   MongoDB   │
                                └─────────────┘
```

## Features

- **JWT Authentication** - Secure token-based auth
- **Role-Based Access Control** - Reporter, Admin, Rescue Team roles
- **ML Integration** - Communicates with Python ML service
- **Incident Management** - Full CRUD operations
- **Status Tracking** - Track incident lifecycle
- **Rescue Team Assignment** - Admin can assign incidents
- **RESTful API** - Clean, documented endpoints

## Prerequisites

- Node.js 16 or higher
- MongoDB (local or Atlas)
- ML Service running (see ml-service/README.md)

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy the example file:
```bash
copy .env.example .env
```

Edit `.env` with your configuration:
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/resqai

# JWT
JWT_SECRET=your_super_secure_secret_key_change_this
JWT_EXPIRE=7d

# ML Service
ML_SERVICE_URL=http://localhost:8000

# Confidence Threshold
CONFIDENCE_THRESHOLD=0.70
```

**Important:** Change `JWT_SECRET` to a secure random string in production!

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas:**
Update `MONGODB_URI` in `.env` with your Atlas connection string.

### 4. Start the Backend Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will start on http://localhost:5000

## API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "reporter",
  "phone": "+1234567890"
}
```

**Roles:**
- `reporter` - Can submit and view their own incidents
- `admin` - Can view all incidents and assign rescue teams
- `rescue_team` - Can view assigned incidents and update status

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "reporter"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

### Incidents

#### Create Incident (Reporter)
```http
POST /api/incidents
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "message": "Building collapsed on Main Street. People trapped inside. Need urgent rescue.",
  "location": {
    "latitude": 30.3398,
    "longitude": 76.3869,
    "address": "Main Street, City"
  }
}
```

Response:
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
      "status": "pending",
      "modelUsed": "BERTweet",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Get My Incidents
```http
GET /api/incidents/my
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Incident by ID
```http
GET /api/incidents/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### Admin Endpoints

#### Get All Incidents with Filters
```http
GET /api/admin/incidents?category=requests_or_urgent_needs&urgency=HIGH&page=1&limit=20
Authorization: Bearer YOUR_JWT_TOKEN (Admin)
```

Query Parameters:
- `category` - Filter by category
- `urgency` - Filter by urgency (LOW, MEDIUM, HIGH)
- `status` - Filter by status
- `priority` - Filter by priority
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

#### Get Incident Statistics
```http
GET /api/admin/incidents/stats
Authorization: Bearer YOUR_JWT_TOKEN (Admin)
```

#### Assign Incident to Rescue Team
```http
POST /api/admin/incidents/:id/assign
Authorization: Bearer YOUR_JWT_TOKEN (Admin)
Content-Type: application/json

{
  "rescueTeamId": "rescue_team_user_id"
}
```

#### Get All Rescue Teams
```http
GET /api/admin/rescue-teams
Authorization: Bearer YOUR_JWT_TOKEN (Admin)
```

### Rescue Team Endpoints

#### Get Assigned Incidents
```http
GET /api/rescue/incidents?status=assigned
Authorization: Bearer YOUR_JWT_TOKEN (Rescue Team)
```

#### Update Incident Status
```http
PATCH /api/rescue/incidents/:id/status
Authorization: Bearer YOUR_JWT_TOKEN (Rescue Team)
Content-Type: application/json

{
  "status": "en_route",
  "notes": "Team dispatched, ETA 15 minutes"
}
```

**Allowed statuses:**
- `accepted` - Team accepted the assignment
- `en_route` - Team is on the way
- `on_site` - Team arrived at location
- `resolved` - Incident resolved

## Project Structure

```
backend/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── incidentController.js  # Incident CRUD
│   ├── adminController.js     # Admin operations
│   └── rescueController.js    # Rescue team operations
├── middleware/
│   ├── authMiddleware.js      # JWT verification
│   ├── roleMiddleware.js      # Role-based access
│   └── errorMiddleware.js     # Error handling
├── models/
│   ├── User.js                # User schema
│   ├── Incident.js            # Incident schema
│   └── ClassificationResult.js # ML result schema
├── routes/
│   ├── authRoutes.js          # Auth endpoints
│   ├── incidentRoutes.js      # Incident endpoints
│   ├── adminRoutes.js         # Admin endpoints
│   └── rescueRoutes.js        # Rescue endpoints
├── services/
│   ├── mlService.js           # ML service client
│   └── incidentService.js     # Business logic
├── utils/
│   └── validation.js          # Input validation
├── server.js                  # App entry point
├── package.json
├── .env.example
└── README.md
```

## Testing with Postman/Insomnia

1. **Register a user** (reporter, admin, rescue_team)
2. **Login** to get JWT token
3. **Set Authorization header** in all subsequent requests:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```
4. **Create incidents** as reporter
5. **Assign incidents** as admin
6. **Update status** as rescue team

## Incident Workflow

```
Reporter submits incident
         │
         v
    [Classification]
    BERTweet + Gemini
         │
         v
   Status: pending
         │
         v
Admin assigns rescue team
         │
         v
   Status: assigned
         │
         v
Team accepts assignment
         │
         v
   Status: accepted
         │
         v
Team dispatches
         │
         v
   Status: en_route
         │
         v
Team arrives
         │
         v
   Status: on_site
         │
         v
Team completes work
         │
         v
   Status: resolved
```

## Classification Logic

### BERTweet Primary Classification
- Message sent to ML service
- BERTweet predicts category + confidence

### Decision Rules
```
IF confidence >= 0.70 AND category != "not_humanitarian":
    Use BERTweet result
ELSE:
    Fall back to Gemini for contextual analysis
```

### Example: High Confidence
```
Message: "We urgently need water and medical supplies"
BERTweet: "requests_or_urgent_needs" (confidence: 0.92)
Result: Use BERTweet (no Gemini call)
```

### Example: Low Confidence
```
Message: "Something happened near the bridge"
BERTweet: "other_relevant_information" (confidence: 0.54)
Result: Call Gemini for contextual analysis
```

### Example: Not Humanitarian
```
Message: "Great weather today!"
BERTweet: "not_humanitarian" (confidence: 0.95)
Result: Call Gemini to verify (safety check)
```

## Security Features

- **Password Hashing** - bcrypt with salt
- **JWT Authentication** - Secure token-based auth
- **Role-Based Access** - Fine-grained permissions
- **Request Validation** - Input sanitization
- **Rate Limiting** - Prevent abuse
- **CORS** - Cross-origin protection
- **Helmet** - Security headers
- **Error Handling** - Safe error messages

## Error Handling

All errors return consistent JSON format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common status codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum['reporter', 'admin', 'rescue_team'],
  phone: String,
  teamId: String
}
```

### Incident
```javascript
{
  message: String,
  reporter: ObjectId (User),
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  category: String,
  confidence: Number,
  humanitarianStatus: Boolean,
  urgency: Enum['LOW', 'MEDIUM', 'HIGH'],
  requestForHelp: Boolean,
  explanation: String,
  modelUsed: Enum['BERTweet', 'Gemini'],
  originalBertweetCategory: String,
  originalBertweetConfidence: Number,
  geminiUsed: Boolean,
  assignedRescueTeam: ObjectId (User),
  status: Enum['pending', 'assigned', 'accepted', 'en_route', 'on_site', 'resolved'],
  statusHistory: Array,
  priority: Enum['low', 'medium', 'high', 'critical'],
  notes: String
}
```

## Troubleshooting

### Cannot connect to MongoDB
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB server or check connection string.

### ML Service unavailable
```
Error: ML service is unavailable
```
**Solution:** Ensure ml-service is running on port 8000.

### Invalid token
```
Error: Not authorized. Invalid token.
```
**Solution:** Login again to get a new token.

### Validation errors
```
Error: Message must be at least 10 characters
```
**Solution:** Check request body matches validation rules.

## Production Deployment

1. **Set NODE_ENV to production**
   ```env
   NODE_ENV=production
   ```

2. **Use strong JWT secret**
   ```env
   JWT_SECRET=very_long_random_secure_string
   ```

3. **Use MongoDB Atlas or managed database**

4. **Set up reverse proxy (nginx)**

5. **Enable HTTPS**

6. **Use process manager (PM2)**
   ```bash
   npm install -g pm2
   pm2 start server.js --name resqai-backend
   ```

7. **Configure firewall**

8. **Set up logging and monitoring**

## Development

Install nodemon for auto-reload:
```bash
npm install -D nodemon
npm run dev
```

## Support

For backend issues:
- Check server logs
- Verify environment variables
- Test ML service connectivity
- Check MongoDB connection
- Verify JWT token validity
