const mongoose = require('mongoose');

const FarmSchema = new mongoose.Schema({
  plantType: {
    type: String,
    required: true,
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  soilAssessment: String,
  recommendations: [String],
}, { timestamps: true });

module.exports = mongoose.model('Farm', FarmSchema);
