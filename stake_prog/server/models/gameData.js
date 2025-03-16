const mongoose = require('mongoose');

const gameDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  games: [{
    buttonBackground: String,
    buttonForeground: String,
    buttonHover: String,
    content: String,
    lastGameIndex: String,
    pastGameId: String
  }]
});

// Index for efficient searching
gameDataSchema.index({ timestamp: 1 });
gameDataSchema.index({ 'games.pastGameId': 1 });

module.exports = mongoose.model('GameData', gameDataSchema);
