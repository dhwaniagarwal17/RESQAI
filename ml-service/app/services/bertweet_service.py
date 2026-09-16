import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import os


class BertweetService:
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model_path = os.getenv('BERTWEET_MODEL_PATH', './models/bertweet_model')
        
    def load_model(self):
        """Load the trained BERTweet model and tokenizer"""
        try:
            print(f"Device: {self.device}")
            print(f"Model path: {self.model_path}")
            
            # Load tokenizer
            self.tokenizer = AutoTokenizer.from_pretrained(
                "vinai/bertweet-base",
                use_fast=False
            )
            
            # Load model
            self.model = AutoModelForSequenceClassification.from_pretrained(
                self.model_path
            )
            
            self.model.to(self.device)
            self.model.eval()
            
            print(f"Model loaded with {self.model.config.num_labels} labels")
            print(f"Label mapping: {self.model.config.id2label}")
            
        except Exception as e:
            print(f"Error loading BERTweet model: {str(e)}")
            print("\nNote: Make sure the trained model is located at:", self.model_path)
            print("If the model is in Google Drive, download it and place it in the ml-service/models/ directory")
            raise
    
    def is_loaded(self):
        """Check if model is loaded"""
        return self.model is not None and self.tokenizer is not None
    
    def predict(self, text: str) -> tuple[str, float]:
        """
        Predict category and confidence for a message
        
        Args:
            text: The message to classify
            
        Returns:
            Tuple of (predicted_category, confidence)
        """
        if not self.is_loaded():
            raise RuntimeError("Model not loaded. Call load_model() first.")
        
        # Tokenize input
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=128
        )
        
        # Move to device
        inputs = {
            key: value.to(self.device)
            for key, value in inputs.items()
        }
        
        # Get prediction
        with torch.no_grad():
            outputs = self.model(**inputs)
        
        # Calculate probabilities
        probabilities = torch.softmax(outputs.logits, dim=-1)
        
        # Get predicted class
        predicted_id = torch.argmax(probabilities, dim=-1).item()
        confidence = probabilities[0, predicted_id].item()
        
        # Get label
        predicted_label = self.model.config.id2label[predicted_id]
        
        return predicted_label, confidence
