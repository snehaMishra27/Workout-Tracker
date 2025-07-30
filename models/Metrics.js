const mongoose = require("mongoose");

const metricsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  weight: {
    type: Number, // in kg
    required: true
  },
  heartRate: {
    type: Number,
    required: true
  },
  sleepHours: {
    type: Number, // in hours
    required:true,
   
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("Metrics", metricsSchema);
