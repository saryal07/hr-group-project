const mongoose = require('mongoose');

const housingSchema = new mongoose.Schema({
  address: String,
  landlord: {
    fullName: String,
    phone: String,
    email: String,
  },
  facility: {
    beds: Number,
    mattresses: Number,
    tables: Number,
    chairs: Number,
  },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }]
}, { timestamps: true });

module.exports = mongoose.model('Housing', housingSchema);