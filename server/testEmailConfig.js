require('dotenv').config();

console.log('=== EmailJS Configuration Test ===\n');

// Check environment variables
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

console.log('Environment Variables:');
console.log('- EMAILJS_SERVICE_ID:', EMAILJS_SERVICE_ID ? '✅ Set' : '❌ Missing');
console.log('- EMAILJS_PUBLIC_KEY:', EMAILJS_PUBLIC_KEY ? '✅ Set' : '❌ Missing');
console.log('- EMAILJS_PRIVATE_KEY:', EMAILJS_PRIVATE_KEY ? '✅ Set' : '❌ Missing');

if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
  console.log('\n❌ Missing required environment variables!');
  console.log('Please add the following to your .env file:');
  console.log('EMAILJS_SERVICE_ID=your_service_id');
  console.log('EMAILJS_PUBLIC_KEY=your_public_key');
  console.log('EMAILJS_PRIVATE_KEY=your_private_key');
  process.exit(1);
}

console.log('\n✅ All environment variables are set!');

// Test EmailJS import
try {
  const emailjs = require('@emailjs/nodejs');
  console.log('✅ EmailJS package imported successfully');
  
  // Test basic EmailJS functionality
  console.log('\nTesting EmailJS basic functionality...');
  console.log('EmailJS version:', require('@emailjs/nodejs/package.json').version);
  
} catch (error) {
  console.log('❌ Failed to import EmailJS:', error.message);
  process.exit(1);
}

console.log('\n=== Configuration Test Complete ===');
console.log('If all checks passed, the issue might be with:');
console.log('1. EmailJS service configuration');
console.log('2. Template setup');
console.log('3. API keys validity'); 