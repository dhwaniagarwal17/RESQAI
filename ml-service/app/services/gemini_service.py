import os
import google.generativeai as genai
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
        self.model = None
        self.model_name = "gemini-pro"
        
    def initialize(self):
        """Initialize Gemini client"""
        api_key = os.getenv('GEMINI_API_KEY')
        
        if not api_key:
            print("WARNING: GEMINI_API_KEY not found in environment variables")
            print("Gemini fallback will not be available")
            return
        
        if not api_key.startswith('AIza'):
            print(f"WARNING: API key format looks incorrect (should start with 'AIza')")
            print(f"Current key starts with: {api_key[:10]}...")
            return
        
        try:
            genai.configure(api_key=api_key)
            
            # List available models to help with debugging
            print("\nFetching available Gemini models...")
            available_models = []
            try:
                for model in genai.list_models():
                    if 'generateContent' in model.supported_generation_methods:
                        available_models.append(model.name)
                        print(f"  - {model.name}")
            except Exception as e:
                print(f"  Could not list models: {e}")
                print(f"  This might indicate an API key issue")
            
            if not available_models:
                print("  No models available - check your API key")
                return
            
            # Try the first available model
            model_name = available_models[0]
            print(f"\nUsing model: {model_name}")
            self.model = genai.GenerativeModel(model_name)
            self.model_name = model_name
            
            # Test with a simple generation
            print("Testing model...")
            test_response = self.model.generate_content("Say 'OK' if you can read this")
            print(f"✓ Model test successful!")
            print(f"✓ Gemini initialized with: {model_name}")
            
        except Exception as e:
            print(f"Error initializing Gemini: {str(e)}")
            import traceback
            traceback.print_exc()
            # Don't raise - allow service to start without Gemini
    
    def is_configured(self):
        """Check if Gemini is configured"""
        return self.model is not None
    
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
You are analyzing a disaster-related social media message for humanitarian classification.

MESSAGE: {text}

A BERTweet model predicted: {bertweet_prediction} (confidence: {bertweet_confidence:.2%})

Analyze this message and provide:
1. The most appropriate category from: caution_and_advice, displaced_people_and_evacuations, infrastructure_and_utility_damage, injured_or_dead_people, missing_or_found_people, not_humanitarian, other_relevant_information, requests_or_urgent_needs, rescue_volunteering_or_donation_effort, sympathy_and_support

2. Is it humanitarian/disaster-related? (true/false)

3. Urgency level: LOW, MEDIUM, or HIGH

4. Is the author requesting help? (true/false)

5. Any location mentioned? (extract location or return "NONE")

6. Brief explanation of your classification

Respond in this JSON format:
{{
  "category": "category_name",
  "humanitarian": true/false,
  "urgency": "LOW/MEDIUM/HIGH",
  "request_for_help": true/false,
  "location": "location or NONE",
  "explanation": "brief explanation"
}}
"""
        
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.1,
                )
            )
            
            # Parse JSON from response
            import json
            result_text = response.text.strip()
            # Remove markdown code blocks if present
            if result_text.startswith("```json"):
                result_text = result_text[7:]
            if result_text.startswith("```"):
                result_text = result_text[3:]
            if result_text.endswith("```"):
                result_text = result_text[:-3]
            result_text = result_text.strip()
            
            result = json.loads(result_text)
            
            return {
                "category": result["category"],
                "humanitarian": result["humanitarian"],
                "urgency": result["urgency"],
                "request_for_help": result["request_for_help"],
                "location": result["location"],
                "explanation": result["explanation"]
            }
            
        except Exception as e:
            print(f"Gemini analysis error: {str(e)}")
            import traceback
            traceback.print_exc()
            raise RuntimeError(f"Gemini analysis failed: {str(e)}")
