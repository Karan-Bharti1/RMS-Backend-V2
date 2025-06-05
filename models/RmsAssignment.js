const mongoose = require('mongoose');

const AllocationSchema = new mongoose.Schema({
  engineerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RmsUser', 
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RmsProject',
    required: true
  },
  allocationPercentage: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  role: {
    type: String,
    enum: ['Developer', 'Tech Lead', 'QA', 'Manager'], // extend as needed
    required: true
  }
});

module.exports = mongoose.model('RmsAssignment', AllocationSchema);
