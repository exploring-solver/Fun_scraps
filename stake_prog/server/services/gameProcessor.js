const IndividualGame = require('../models/individualGame');

async function processGamesArray(games, timestamp) {
  for (const game of games) {
    try {
      // Try to find existing game entry
      const existingGame = await IndividualGame.findOne({ pastGameId: game.pastGameId });
      
      if (existingGame) {
        // Update existing game
        await IndividualGame.updateOne(
          { pastGameId: game.pastGameId },
          {
            $set: {
              lastSeen: timestamp,
              content: game.content,
              lastGameIndex: game.lastGameIndex
            },
            $inc: { occurrences: 1 },
            $push: { timestamps: timestamp }
          }
        );
      } else {
        // Create new game entry
        await IndividualGame.create({
          pastGameId: game.pastGameId,
          firstSeen: timestamp,
          lastSeen: timestamp,
          content: game.content,
          lastGameIndex: game.lastGameIndex,
          timestamps: [timestamp]
        });
      }
    } catch (error) {
      console.error(`Error processing game ${game.pastGameId}:`, error);
    }
  }
}

// Function to process existing GameData entries
async function processExistingGameData(GameData) {
  const cursor = GameData.find().cursor();
  
  for (let gameData = await cursor.next(); gameData != null; gameData = await cursor.next()) {
    await processGamesArray(gameData.games, gameData.timestamp);
  }
}

module.exports = { processGamesArray, processExistingGameData };