import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import os
from pathlib import Path


class BertweetService:
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.load_error = None
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        # Resolve the model path relative to this file (ml-service/app/services/)
        # so it works no matter what the current working directory is.
        default_path = Path(__file__).resolve().parents[2] / 'models' / 'bertweet_model'
        env_path = os.getenv('BERTWEET_MODEL_PATH')
        if env_path and Path(env_path).is_absolute():
            self.model_path = env_path
        elif env_path:
            # Relative path from env: resolve against the ml-service root
            self.model_path = str((Path(__file__).resolve().parents[2] / env_path).resolve())
        else:
            self.model_path = str(default_path)
        
    def load_model(self):
        """Load the trained BERTweet model and tokenizer"""
        try:
            print(f"Device: {self.device}")
            print(f"Model path: {self.model_path}")
            
            if not Path(self.model_path).exists():
                raise FileNotFoundError(
                    f"Model directory not found: {self.model_path}\n"
                    "Make sure the trained model is placed in ml-service/models/bertweet_model/"
                )

            # Load tokenizer
            self.tokenizer = AutoTokenizer.from_pretrained(
                "vinai/bertweet-base",
                use_fast=False
            )
            
            # Load model from local path
            self.model = AutoModelForSequenceClassification.from_pretrained(
                self.model_path,
                local_files_only=True
            )
            
            self.model.to(self.device)
            self.model.eval()
            self.load_error = None
            
            print(f"Model loaded with {self.model.config.num_labels} labels")
            print(f"Label mapping: {self.model.config.id2label}")
            
        except Exception as e:
            self.load_error = str(e)
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
            hint = f" Reason: {self.load_error}" if self.load_error else ""
            raise RuntimeError(f"BERTweet model not loaded.{hint}")
        
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
