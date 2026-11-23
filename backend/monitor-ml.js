const mlService = require('./services/mlService');

let successCount = 0;
let failureCount = 0;

async function monitor() {
  // Clear screen (works on Windows and Unix)
  console.clear();
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('              RESQAI ML Service Monitor');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    const health = await mlService.healthCheck();
    const isHealthy = health.status === 'healthy';
    
    if (isHealthy) successCount++;
    else failureCount++;

    // Status
    console.log('🔵 Service Status');
    console.log('───────────────────────────────────────────────────────────');
    console.log(`   Overall: ${isHealthy ? '✓ HEALTHY' : '✗ UNAVAILABLE'}`);
    console.log(`   URL: ${process.env.ML_SERVICE_URL || 'http://localhost:8000'}`);
    console.log(`   Uptime: ${successCount} checks passed, ${failureCount} failed\n`);

    // Components
    console.log('🤖 Components');
    console.log('───────────────────────────────────────────────────────────');
    console.log(`   BERTweet Model: ${health.bertweet_loaded ? '✓ Loaded' : '✗ Not loaded'}`);
    console.log(`   Gemini API: ${health.gemini_configured ? '✓ Configured' : '✗ Not configured'}`);
    console.log(`   Confidence Threshold: ${process.env.CONFIDENCE_THRESHOLD || '0.70'}\n`);

    // Last Check
    console.log('⏰ Last Check');
    console.log('───────────────────────────────────────────────────────────');
    console.log(`   ${new Date().toLocaleString()}\n`);

    // Status indicator
    if (isHealthy) {
      console.log('✅ All systems operational');
    } else {
      console.log('⚠️  ML service is not responding properly');
      console.log('   • Check if ML service is running');
      console.log('   • Verify model files are present');
      console.log('   • Check Gemini API key');
    }

  } catch (error) {
    failureCount++;
    console.log('🔴 Connection Error');
    console.log('───────────────────────────────────────────────────────────');
    console.log(`   ${error.message}\n`);
    console.log('❌ Cannot connect to ML service');
    console.log('   • Make sure ML service is running on port 8000');
    console.log('   • Run: cd ml-service && python -m app.main');
    console.log(`   • Uptime: ${successCount} checks passed, ${failureCount} failed`);
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  Refreshing in 5 seconds... (Press Ctrl+C to stop)');
  console.log('═══════════════════════════════════════════════════════════');
}

// Load environment variables
require('dotenv').config();

// Initial check
monitor();

// Check every 5 seconds
const interval = setInterval(monitor, 5000);

// Cleanup on exit
process.on('SIGINT', () => {
  console.log('\n\nMonitoring stopped.');
  console.log(`Final Stats: ${successCount} successful checks, ${failureCount} failures`);
  clearInterval(interval);
  process.exit(0);
});
