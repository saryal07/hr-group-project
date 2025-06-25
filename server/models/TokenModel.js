const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  used: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model('RegistrationToken', tokenSchema);