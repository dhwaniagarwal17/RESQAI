const axios = require('axios');

class MLService {
  constructor() {
    this.baseURL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    this.confidenceThreshold = parseFloat(process.env.CONFIDENCE_THRESHOLD) || 0.70;
  }

  async classifyMessage(message) {
    try {
      const startTime = Date.now();

      const response = await axios.post(`${this.baseURL}/classify`, {
        message,
        confidence_threshold: this.confidenceThreshold
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const processingTime = Date.now() - startTime;

      return {
        ...response.data,
        processingTime
      };
    } catch (error) {
      console.error('ML Service Error:', error.message);
      
      if (error.code === 'ECONNREFUSED') {
        throw new Error('ML service is unavailable. Please ensure the ML service is running.');
      }
      
      if (error.response) {
        throw new Error(error.response.data.detail || 'ML service returned an error');
      }
      
      throw new Error('Failed to classify message with ML service');
    }
  }

  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseURL}/health`, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      return {
        status: 'unavailable',
        error: error.message
      };
    }
  }
}

module.exports = new MLService();
