const mongoose = require('mongoose');

const SystemErrorLogSchema = new mongoose.Schema({
  errorMessage: {
    type: String,
    required: true
  },
  stackTrace: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sessionData: {
    type: mongoose.Schema.Types.Mixed
  },
  logDestination: {
    type: String,
    enum: ['DATABASE', 'LOCAL_FILE_SYSTEM'],
    default: 'DATABASE'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SystemErrorLog', SystemErrorLogSchema);
