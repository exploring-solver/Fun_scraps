const mongoose = require('mongoose');

const individualGameSchema = new mongoose.Schema({
  pastGameId: { type: String, unique: true },
  firstSeen: { type: Date },
  lastSeen: { type: Date },
  content: String,
  lastGameIndex: String,
  occurrences: { type: Number, default: 1 },
  // Store all timestamps when this game was seen
  timestamps: [Date]
});

individualGameSchema.index({ pastGameId: 1 }, { unique: true });
individualGameSchema.index({ firstSeen: 1 });
individualGameSchema.index({ lastSeen: 1 });

module.exports = mongoose.model('IndividualGame', individualGameSchema);