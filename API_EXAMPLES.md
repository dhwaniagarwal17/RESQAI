# RESQAI API Examples

Complete API examples using curl, suitable for testing with Postman, Insomnia, or command line.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 1. Authentication Endpoints

### 1.1 Register Reporter

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Reporter",
    "email": "john@reporter.com",
    "password": "password123",
    "role": "reporter",
    "phone": "+1234567890"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65abc123...",
      "name": "John Reporter",
      "email": "john@reporter.com",
      "role": "reporter"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.2 Register Admin

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@resqai.com",
    "password": "admin123",
    "role": "admin"
  }'
```

### 1.3 Register Rescue Team

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rescue Team Alpha",
    "email": "team.alpha@rescue.com",
    "password": "rescue123",
    "role": "rescue_team",
    "phone": "+1987654321",
    "teamId": "ALPHA-001"
  }'
```

### 1.4 Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@reporter.com",
    "password": "password123"
  }'
```

### 1.5 Get Current User

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 2. Reporter Endpoints

### 2.1 Create Incident (High Priority)

```bash
curl -X POST http://localhost:5000/api/incidents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer REPORTER_TOKEN" \
  -d '{
    "message": "Building collapsed on Main Street. Multiple people trapped inside. Urgent rescue needed immediately!",
    "location": {
      "latitude": 30.3398,
      "longitude": 76.3869,
      "address": "Main Street, Sector 15, Chandigarh"
    }
  }'
```

**Expected Classification:**
- Category: `infrastructure_and_utility_damage` or `requests_or_urgent_needs`
- High confidence (>0.70)
- BERTweet only (no Gemini)

### 2.2 Create Incident (Medical Emergency)

```bash
curl -X POST http://localhost:5000/api/incidents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer REPORTER_TOKEN" \
  -d '{
    "message": "Multiple casualties reported. Need medical assistance immediately. People are injured and require urgent attention.",
    "location": {
      "latitude": 30.3398,
      "longitude": 76.3869
    }
  }'
```

**Expected Classification:**
- Category: `injured_or_dead_people`
- High confidence
- Urgency: HIGH

### 2.3 Create Incident (Ambiguous - Triggers Gemini)

```bash
curl -X POST http://localhost:5000/api/incidents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer REPORTER_TOKEN" \
  -d '{
    "message": "Something unusual happened near the old bridge this morning. Not sure what exactly.",
    "location": {
      "latitude": 30.3398,
      "longitude": 76.3869
    }
  }'
```

**Expected Classification:**
- Low confidence (<0.70)
- Gemini fallback triggered
- Additional context from Gemini

### 2.4 Create Incident (Not Humanitarian - Triggers Gemini)

```bash
curl -X POST http://localhost:5000/api/incidents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer REPORTER_TOKEN" \
  -d '{
    "message": "Beautiful weather today! Perfect day for a picnic. #blessed"
  }'
```

**Expected Classification:**
- Category: `not_humanitarian`
- Gemini verifies
- humanitarian: false

### 2.5 Get My Incidents

```bash
curl -X GET http://localhost:5000/api/incidents/my \
  -H "Authorization: Bearer REPORTER_TOKEN"
```

### 2.6 Get Specific Incident

```bash
curl -X GET http://localhost:5000/api/incidents/INCIDENT_ID \
  -H "Authorization: Bearer REPORTER_TOKEN"
```

### 2.7 Update My Incident

```bash
curl -X PATCH http://localhost:5000/api/incidents/INCIDENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer REPORTER_TOKEN" \
  -d '{
    "location": {
      "latitude": 30.3400,
      "longitude": 76.3870,
      "address": "Updated location: Near City Hospital"
    },
    "notes": "Situation worsening. Please hurry."
  }'
```

---

## 3. Admin Endpoints

### 3.1 Get All Incidents

```bash
curl -X GET http://localhost:5000/api/admin/incidents \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 3.2 Get Incidents with Filters

```bash
# Filter by category
curl -X GET "http://localhost:5000/api/admin/incidents?category=requests_or_urgent_needs" \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Filter by urgency
curl -X GET "http://localhost:5000/api/admin/incidents?urgency=HIGH" \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Filter by status
curl -X GET "http://localhost:5000/api/admin/incidents?status=pending" \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Multiple filters + pagination
curl -X GET "http://localhost:5000/api/admin/incidents?category=injured_or_dead_people&urgency=HIGH&status=pending&page=1&limit=10" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 3.3 Get Incident Statistics

```bash
curl -X GET http://localhost:5000/api/admin/incidents/stats \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total": 42,
      "pending": 15,
      "assigned": 10,
      "resolved": 12
    },
    "byCategory": [
      {"_id": "requests_or_urgent_needs", "count": 12},
      {"_id": "infrastructure_and_utility_damage", "count": 8}
    ],
    "byUrgency": [
      {"_id": "HIGH", "count": 18},
      {"_id": "MEDIUM", "count": 15},
      {"_id": "LOW", "count": 9}
    ],
    "byModel": [
      {"_id": "BERTweet", "count": 28},
      {"_id": "Gemini", "count": 14}
    ]
  }
}
```

### 3.4 Get All Rescue Teams

```bash
curl -X GET http://localhost:5000/api/admin/rescue-teams \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 3.5 Assign Incident to Rescue Team

```bash
curl -X POST http://localhost:5000/api/admin/incidents/INCIDENT_ID/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "rescueTeamId": "RESCUE_TEAM_USER_ID"
  }'
```

### 3.6 Update Incident Details

```bash
curl -X PATCH http://localhost:5000/api/admin/incidents/INCIDENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "status": "assigned",
    "priority": "critical",
    "urgency": "HIGH",
    "notes": "High priority incident. Rescue team dispatched."
  }'
```

---

## 4. Rescue Team Endpoints

### 4.1 Get Assigned Incidents

```bash
curl -X GET http://localhost:5000/api/rescue/incidents \
  -H "Authorization: Bearer RESCUE_TEAM_TOKEN"
```

### 4.2 Get Assigned Incidents by Status

```bash
curl -X GET "http://localhost:5000/api/rescue/incidents?status=assigned" \
  -H "Authorization: Bearer RESCUE_TEAM_TOKEN"
```

### 4.3 Get Incident Details

```bash
curl -X GET http://localhost:5000/api/rescue/incidents/INCIDENT_ID \
  -H "Authorization: Bearer RESCUE_TEAM_TOKEN"
```

### 4.4 Accept Assignment

```bash
curl -X PATCH http://localhost:5000/api/rescue/incidents/INCIDENT_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer RESCUE_TEAM_TOKEN" \
  -d '{
    "status": "accepted",
    "notes": "Assignment accepted. Preparing to dispatch."
  }'
```

### 4.5 Update Status: En Route

```bash
curl -X PATCH http://localhost:5000/api/rescue/incidents/INCIDENT_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer RESCUE_TEAM_TOKEN" \
  -d '{
    "status": "en_route",
    "notes": "Team dispatched. ETA 15 minutes."
  }'
```

### 4.6 Update Status: On Site

```bash
curl -X PATCH http://localhost:5000/api/rescue/incidents/INCIDENT_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer RESCUE_TEAM_TOKEN" \
  -d '{
    "status": "on_site",
    "notes": "Team arrived at location. Assessing situation."
  }'
```

### 4.7 Update Status: Resolved

```bash
curl -X PATCH http://localhost:5000/api/rescue/incidents/INCIDENT_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer RESCUE_TEAM_TOKEN" \
  -d '{
    "status": "resolved",
    "notes": "All individuals rescued. Medical assistance provided. Area secured."
  }'
```

### 4.8 Add Notes to Incident

```bash
curl -X POST http://localhost:5000/api/rescue/incidents/INCIDENT_ID/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer RESCUE_TEAM_TOKEN" \
  -d '{
    "notes": "Found 3 survivors. Awaiting medical transport."
  }'
```

---

## 5. Complete Workflow Example

### Step 1: Setup Users

```bash
# Register Reporter
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Reporter","email":"reporter@test.com","password":"test123","role":"reporter"}'

# Register Admin
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@test.com","password":"test123","role":"admin"}'

# Register Rescue Team
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Team Alpha","email":"alpha@rescue.com","password":"test123","role":"rescue_team","teamId":"ALPHA-001"}'
```

### Step 2: Reporter Creates Incident

```bash
# Login as reporter
REPORTER_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"reporter@test.com","password":"test123"}' | jq -r '.data.token')

# Create incident
INCIDENT_ID=$(curl -s -X POST http://localhost:5000/api/incidents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $REPORTER_TOKEN" \
  -d '{"message":"Building fire! People trapped!","location":{"latitude":30.3398,"longitude":76.3869}}' | jq -r '.data.incident._id')

echo "Incident created: $INCIDENT_ID"
```

### Step 3: Admin Assigns Rescue Team

```bash
# Login as admin
ADMIN_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"test123"}' | jq -r '.data.token')

# Get rescue teams
RESCUE_TEAMS=$(curl -s -X GET http://localhost:5000/api/admin/rescue-teams \
  -H "Authorization: Bearer $ADMIN_TOKEN")

# Get first rescue team ID
RESCUE_TEAM_ID=$(echo $RESCUE_TEAMS | jq -r '.data.rescueTeams[0].id')

# Assign incident
curl -X POST http://localhost:5000/api/admin/incidents/$INCIDENT_ID/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"rescueTeamId\":\"$RESCUE_TEAM_ID\"}"
```

### Step 4: Rescue Team Responds

```bash
# Login as rescue team
RESCUE_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alpha@rescue.com","password":"test123"}' | jq -r '.data.token')

# Accept assignment
curl -X PATCH http://localhost:5000/api/rescue/incidents/$INCIDENT_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $RESCUE_TOKEN" \
  -d '{"status":"accepted","notes":"Assignment accepted"}'

# En route
curl -X PATCH http://localhost:5000/api/rescue/incidents/$INCIDENT_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $RESCUE_TOKEN" \
  -d '{"status":"en_route","notes":"ETA 10 minutes"}'

# On site
curl -X PATCH http://localhost:5000/api/rescue/incidents/$INCIDENT_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $RESCUE_TOKEN" \
  -d '{"status":"on_site","notes":"Arrived at location"}'

# Resolved
curl -X PATCH http://localhost:5000/api/rescue/incidents/$INCIDENT_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $RESCUE_TOKEN" \
  -d '{"status":"resolved","notes":"All clear. Mission complete."}'
```

---

## 6. Testing Classification Logic

### Test BERTweet High Confidence (No Gemini)

```bash
curl -X POST http://localhost:5000/api/incidents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer REPORTER_TOKEN" \
  -d '{
    "message": "Urgent! We need water, food, and medical supplies immediately. Multiple casualties."
  }'
```

**Check response:**
- `modelUsed` should be `"BERTweet"`
- `geminiUsed` should be `false`
- `confidence` should be `> 0.70`

### Test Low Confidence (Gemini Fallback)

```bash
curl -X POST http://localhost:5000/api/incidents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer REPORTER_TOKEN" \
  -d '{
    "message": "Heard some noise from the construction site. Not sure what happened."
  }'
```

**Check response:**
- `modelUsed` should be `"Gemini"`
- `geminiUsed` should be `true`
- Should have `urgency`, `humanitarian`, `explanation` fields

### Test Not Humanitarian (Gemini Verification)

```bash
curl -X POST http://localhost:5000/api/incidents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer REPORTER_TOKEN" \
  -d '{
    "message": "Just had the best coffee ever! #CoffeeLovers"
  }'
```

**Check response:**
- `modelUsed` should be `"Gemini"`
- `geminiUsed` should be `true`
- `humanitarian` should be `false`

---

## PowerShell Examples (Windows)

For Windows users using PowerShell:

```powershell
# Register user
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "test123"
    role = "reporter"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

# Login
$loginBody = @{
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $loginBody

$token = $response.data.token

# Create incident
$incidentBody = @{
    message = "Emergency situation"
    location = @{
        latitude = 30.3398
        longitude = 76.3869
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/incidents" `
    -Method Post `
    -ContentType "application/json" `
    -Headers @{Authorization = "Bearer $token"} `
    -Body $incidentBody
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Message must be at least 10 characters",
      "param": "message"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized. Invalid token."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'reporter' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Incident not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

**All examples tested and working!**
