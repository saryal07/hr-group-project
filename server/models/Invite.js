const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
  email: String,
  name: String,
  token: String,
  registered: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Invite', inviteSchema);