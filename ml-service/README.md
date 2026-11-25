# RESQAI ML Service

Machine Learning inference service for RESQAI disaster message classification.

## Architecture

This service provides a FastAPI-based REST API that:
1. Loads the trained BERTweet model
2. Performs primary classification
3. Falls back to Gemini for low-confidence or "not_humanitarian" predictions
4. Returns structured classification results to the Node.js backend

## Prerequisites

- Python 3.8 or higher
- pip
- Trained BERTweet model files
- Gemini API key

## Setup Instructions

### 1. Create Python Virtual Environment

```bash
cd ml-service
python -m venv venv
```

### 2. Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Download Your Trained Model

Your trained BERTweet model needs to be placed in the `models/` directory.

**If your model is in Google Drive:**

1. Download the model from `/content/drive/MyDrive/resqai_bertweet_final`
2. Create a `models/` directory in ml-service:
   ```bash
   mkdir models
   ```
3. Copy your model files into `models/bertweet_model/`:
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

**Required model files:**
- `config.json` - Model configuration with label mappings
- `pytorch_model.bin` - Model weights
- Tokenizer files (vocab.txt, etc.)

### 5. Configure Environment Variables

Copy the example env file:
```bash
copy .env.example .env
```

Edit `.env` and add your configuration:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
BERTWEET_MODEL_PATH=./models/bertweet_model
```

**Get Gemini API Key:**
1. Go to https://aistudio.google.com/app/apikey
2. Create a new API key
3. Copy it to your .env file

### 6. Start the ML Service

```bash
python -m app.main
```

Or with uvicorn directly:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The service will start on http://localhost:8000

## API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "healthy",
  "bertweet_loaded": true,
  "gemini_configured": true,
  "timestamp": 1234567890.123
}
```

### Classify Message
```
POST /classify
```

Request body:
```json
{
  "message": "We urgently need medical supplies and water",
  "confidence_threshold": 0.70
}
```

Response (BERTweet only):
```json
{
  "model_used": "BERTweet",
  "bertweet_prediction": "requests_or_urgent_needs",
  "bertweet_confidence": 0.92,
  "final_category": "requests_or_urgent_needs",
  "gemini_used": false
}
```

Response (with Gemini):
```json
{
  "model_used": "Gemini",
  "bertweet_prediction": "other_relevant_information",
  "bertweet_confidence": 0.54,
  "final_category": "requests_or_urgent_needs",
  "gemini_used": true,
  "humanitarian": true,
  "urgency": "HIGH",
  "request_for_help": true,
  "location": "NONE",
  "explanation": "Message explicitly requests urgent medical supplies and water"
}
```

## Testing the Service

### Test with curl:

```bash
curl -X POST http://localhost:8000/classify -H "Content-Type: application/json" -d "{\"message\": \"We need help urgently\"}"
```

### Test with Python:

```python
import requests

response = requests.post(
    "http://localhost:8000/classify",
    json={
        "message": "Building collapsed, people trapped inside",
        "confidence_threshold": 0.70
    }
)

print(response.json())
```

## Model Categories

The BERTweet model classifies messages into these 10 categories:

1. `caution_and_advice`
2. `displaced_people_and_evacuations`
3. `infrastructure_and_utility_damage`
4. `injured_or_dead_people`
5. `missing_or_found_people`
6. `not_humanitarian`
7. `other_relevant_information`
8. `requests_or_urgent_needs`
9. `rescue_volunteering_or_donation_effort`
10. `sympathy_and_support`

## Classification Logic

1. **Primary Classification (BERTweet)**
   - Model predicts category and confidence score
   
2. **Decision Point**
   - IF confidence >= 0.70 AND category != "not_humanitarian":
     - Use BERTweet result
   - ELSE:
     - Fall back to Gemini

3. **Secondary Analysis (Gemini)**
   - Provides contextual understanding
   - Returns structured analysis with urgency, location, etc.

## Troubleshooting

### Model Not Found Error
```
Error: Model path not found: ./models/bertweet_model
```
**Solution:** Download and place your trained model in the correct directory.

### Gemini API Error
```
Error: GEMINI_API_KEY not found
```
**Solution:** Add your Gemini API key to `.env` file.

### Import Errors
```
ModuleNotFoundError: No module named 'transformers'
```
**Solution:** Ensure virtual environment is activated and dependencies are installed:
```bash
pip install -r requirements.txt
```

### CUDA/GPU Warnings
The service will automatically use CPU if CUDA is not available. This is normal and expected for most setups.

## Integration with Backend

The Node.js backend communicates with this service via:
- **URL:** http://localhost:8000
- **Endpoint:** POST /classify
- **Configuration:** Set `ML_SERVICE_URL` in backend .env

The backend's `mlService.js` handles all communication.

## Production Deployment

For production:
1. Use a process manager (PM2, systemd, etc.)
2. Set up proper logging
3. Configure firewall rules
4. Use HTTPS if exposed externally
5. Monitor resource usage
6. Set appropriate confidence thresholds

## Development

To run in development mode with auto-reload:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Support

For issues related to:
- Model loading: Check model path and file structure
- Gemini API: Verify API key and quota
- Performance: Consider GPU usage or model optimization
