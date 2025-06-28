const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/db');

async function approveDocument() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Import the Document model
    const Document = require('./models/Document');
    
    // Find and update the OPT Receipt document
    const result = await Document.findOneAndUpdate(
      { 
        documentType: 'opt_receipt',
        employee: '685c763b500990cfee070335' // Your user ID
      },
      { 
        status: 'approved',
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (result) {
      console.log('✅ Document approved successfully!');
      console.log('Document ID:', result._id);
      console.log('Status:', result.status);
      console.log('Document Type:', result.documentType);
    } else {
      console.log('❌ No document found to approve');
    }
    
  } catch (error) {
    console.error('❌ Error approving document:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

approveDocument(); 