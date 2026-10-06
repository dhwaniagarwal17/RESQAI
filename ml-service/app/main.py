from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Literal
import uvicorn
import os
import time

from app.services.bertweet_service import BertweetService
from app.services.gemini_service import GeminiService

app = FastAPI(
    title="RESQAI ML Service",
    description="Machine Learning inference service for RESQAI disaster classification",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
bertweet_service = BertweetService()
gemini_service = GeminiService()


class ClassificationRequest(BaseModel):
    message: str
    confidence_threshold: Optional[float] = 0.70


class ClassificationResponse(BaseModel):
    model_used: str
    bertweet_prediction: str
    bertweet_confidence: float
    final_category: str
    gemini_used: bool
    humanitarian: Optional[bool] = None
    urgency: Optional[str] = None
    request_for_help: Optional[bool] = None
    location: Optional[str] = None
    explanation: Optional[str] = None


@app.on_event("startup")
async def startup_event():
    """Load models on startup"""
    print("=" * 60)
    print("RESQAI ML Service Starting...")
    print("=" * 60)
    
    print("\n[1/2] Loading BERTweet model...")
    bertweet_service.load_model()
    print("✓ BERTweet model loaded successfully")
    
    print("\n[2/2] Initializing Gemini service...")
    gemini_service.initialize()
    print("✓ Gemini service initialized")
    
    print("\n" + "=" * 60)
    print("ML Service Ready!")
    print("=" * 60 + "\n")


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "service": "RESQAI ML Service",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "bertweet_loaded": bertweet_service.is_loaded(),
        "gemini_configured": gemini_service.is_configured(),
        "timestamp": time.time()
    }


@app.post("/classify", response_model=ClassificationResponse)
async def classify_message(request: ClassificationRequest):
    """
    Classify a disaster-related message using the hybrid BERTweet + Gemini approach
    
    Flow:
    1. Get BERTweet prediction
    2. If confidence >= threshold AND category != "not_humanitarian":
       - Return BERTweet result
    3. Else:
       - Call Gemini for contextual analysis
       - Return Gemini result
    """
    try:
        # Validate input
        if not request.message or len(request.message.strip()) == 0:
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # Step 1: Get BERTweet prediction
        bertweet_category, bertweet_confidence = bertweet_service.predict(request.message)
        
        # Step 2: Determine if Gemini is needed
        send_to_gemini = (
            bertweet_confidence < request.confidence_threshold
            or bertweet_category == "not_humanitarian"
        )
        
        # Step 3: If high confidence and not "not_humanitarian", use BERTweet
        if not send_to_gemini:
            return ClassificationResponse(
                model_used="BERTweet",
                bertweet_prediction=bertweet_category,
                bertweet_confidence=bertweet_confidence,
                final_category=bertweet_category,
                gemini_used=False
            )
        
        # Step 4: Use Gemini for contextual analysis
        gemini_result = gemini_service.analyze(
            text=request.message,
            bertweet_prediction=bertweet_category,
            bertweet_confidence=bertweet_confidence
        )
        
        return ClassificationResponse(
            model_used="Gemini",
            bertweet_prediction=bertweet_category,
            bertweet_confidence=bertweet_confidence,
            final_category=gemini_result["category"],
            gemini_used=True,
            humanitarian=gemini_result["humanitarian"],
            urgency=gemini_result["urgency"],
            request_for_help=gemini_result["request_for_help"],
            location=gemini_result["location"],
            explanation=gemini_result["explanation"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Classification error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Classification failed: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=False
    )
