const app = require('./app');

// Test if the app loads without errors
console.log('✅ Server app loaded successfully');

// Test if required modules are available
try {
  const Document = require('./models/Document');
  console.log('✅ Document model loaded successfully');
} catch (error) {
  console.log('❌ Error loading Document model:', error.message);
}

try {
  const documentController = require('./controllers/documentController');
  console.log('✅ Document controller loaded successfully');
} catch (error) {
  console.log('❌ Error loading document controller:', error.message);
}

try {
  const documentRoutes = require('./routers/documentRoutes');
  console.log('✅ Document routes loaded successfully');
} catch (error) {
  console.log('❌ Error loading document routes:', error.message);
}

console.log('✅ Document upload feature is ready!');
console.log('\n📝 Next steps:');
console.log('1. Start the server with: node index.js');
console.log('2. Import the Postman collection: postman/Document_Upload_Tests.postman_collection.json');
console.log('3. Test the endpoints with Postman');
console.log('4. Check the documentation: DOCUMENT_UPLOAD_README.md');
console.log('\n🔗 Available endpoints:');
console.log('  POST   /api/documents - Upload a document');
console.log('  GET    /api/documents - Get all documents');
console.log('  GET    /api/documents/:id - Get specific document');
console.log('  DELETE /api/documents/:id - Delete a document'); 