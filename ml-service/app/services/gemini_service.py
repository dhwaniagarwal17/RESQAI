import os
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import Literal


class GeminiAnalysis(BaseModel):
    """Schema for Gemini's structured response"""
    category: Literal[
        "caution_and_advice",
        "displaced_people_and_evacuations",
        "infrastructure_and_utility_damage",
        "injured_or_dead_people",
        "missing_or_found_people",
        "not_humanitarian",
        "other_relevant_information",
        "requests_or_urgent_needs",
        "rescue_volunteering_or_donation_effort",
        "sympathy_and_support"
    ]
    humanitarian: bool
    urgency: Literal["LOW", "MEDIUM", "HIGH"]
    request_for_help: bool
    location: str
    explanation: str


class GeminiService:
    def __init__(self):
        self.client = None
        self.model_name = "gemini-2.0-flash-exp"
        
    def initialize(self):
        """Initialize Gemini client"""
        api_key = os.getenv('GEMINI_API_KEY')
        
        if not api_key:
            print("WARNING: GEMINI_API_KEY not found in environment variables")
            print("Gemini fallback will not be available")
            return
        
        try:
            self.client = genai.Client(api_key=api_key)
            print(f"Gemini client initialized with model: {self.model_name}")
        except Exception as e:
            print(f"Error initializing Gemini: {str(e)}")
            raise
    
    def is_configured(self):
        """Check if Gemini is configured"""
        return self.client is not None
    
    def analyze(self, text: str, bertweet_prediction: str, bertweet_confidence: float) -> dict:
        """
        Analyze message using Gemini for contextual understanding
        
        Args:
            text: The message to analyze
            bertweet_prediction: BERTweet's prediction
            bertweet_confidence: BERTweet's confidence score
            
        Returns:
            Dictionary with Gemini's analysis
        """
        if not self.is_configured():
            raise RuntimeError("Gemini not configured. Set GEMINI_API_KEY environment variable.")
        
        prompt = f"""
You are the secondary analysis component of RESQAI,
an AI-assisted humanitarian disaster information system.

Analyze the following social-media message related to a possible
disaster or emergency.

MESSAGE:
{text}

The primary BERTweet classifier predicted:

Category: {bertweet_prediction}
Confidence: {bertweet_confidence:.2%}

Your task is to independently analyze the message and select the
MOST appropriate humanitarian category.

You MUST choose exactly one of the categories provided in the output schema.

Consider the actual meaning and context of the message rather than
relying only on disaster-related keywords.

Determine:
- the most appropriate humanitarian category
- whether the message is humanitarian/relevant
- urgency (LOW, MEDIUM, or HIGH)
- whether the author is requesting help
- any explicitly mentioned location
- a concise explanation for the classification

For LOCATION:
Return the explicitly mentioned location if one exists.
If no location is present, return "NONE".

Do not invent information that is not present in the message.
"""
        
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=GeminiAnalysis
                )
            )
            
            result = response.parsed
            
            return {
                "category": result.category,
                "humanitarian": result.humanitarian,
                "urgency": result.urgency,
                "request_for_help": result.request_for_help,
                "location": result.location,
                "explanation": result.explanation
            }
            
        except Exception as e:
            print(f"Gemini analysis error: {str(e)}")
            raise RuntimeError(f"Gemini analysis failed: {str(e)}")
