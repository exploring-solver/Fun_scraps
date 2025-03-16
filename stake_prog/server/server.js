const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const GameData = require('./models/gameData');
const { processExistingGameData } = require('./services/gameProcessor');
const individualGame = require('./models/individualGame');
const { Parser } = require('json2csv');
const path = require('path');
const fs =  require('fs');
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/gameTracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.post('/api/games', async (req, res) => {
    try {
        const gameData = new GameData({
            games: req.body.data
        });
        await processExistingGameData(GameData);
        await gameData.save();
        res.status(201).json({ message: 'Data saved successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/api/process-existing-data', async (req, res) => {
    try {
        await processExistingGameData(GameData);
        res.json({ message: 'Historical data processing completed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/games', async (req, res) => {
    try {
        const { startDate, endDate, pastGameId, page = 1, limit = 10 } = req.query;
        let query = {};

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        if (pastGameId) {
            query['games.pastGameId'] = pastGameId;
        }

        const skip = (page - 1) * limit;

        const data = await GameData.find(query)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await GameData.countDocuments(query);

        res.json({
            data,
            total,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/unique-games', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        // Aggregation to get unique game entries based on `pastGameId`
        const result = await GameData.aggregate([
            { $unwind: "$games" },
            {
                $group: {
                    _id: "$games.pastGameId",
                    game: { $first: "$games" },
                    firstTimestamp: { $first: "$timestamp" }  // Capture the first timestamp of the game entry
                }
            },
            { $sort: { "_id": 1 } },
            { $skip: skip },
            { $limit: parseInt(limit) }
        ]);

        const total = await GameData.aggregate([
            { $unwind: "$games" },
            { $group: { _id: "$games.pastGameId" } },
            { $count: "total" }
        ]);

        res.json({
            data: result.map(entry => ({ ...entry.game, firstTimestamp: entry.firstTimestamp })),
            total: total.length > 0 ? total[0].total : 0,
            pages: Math.ceil((total.length > 0 ? total[0].total : 0) / limit)
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// New endpoint to get individual games with filters
app.get('/api/individual-games', async (req, res) => {
    try {
        const { startDate, endDate, pastGameId, page = 1, limit = 10 } = req.query;
        let query = {};

        if (startDate || endDate) {
            query.lastSeen = {};
            if (startDate) query.lastSeen.$gte = new Date(startDate);
            if (endDate) query.lastSeen.$lte = new Date(endDate);
        }

        if (pastGameId) {
            query.pastGameId = pastGameId;
        }

        const skip = (page - 1) * limit;

        const data = await individualGame.find(query)
            .sort({ lastSeen: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await individualGame.countDocuments(query);

        res.json({
            data,
            total,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/export-individual-games-csv', async (req, res) => {
    try {
        const { startDate, endDate, pastGameId } = req.query;
        let query = {};

        if (startDate || endDate) {
            query.lastSeen = {};
            if (startDate) query.lastSeen.$gte = new Date(startDate);
            if (endDate) query.lastSeen.$lte = new Date(endDate);
        }

        if (pastGameId) {
            query.pastGameId = pastGameId;
        }

        // Fetch data excluding `timestamps` field
        const data = await individualGame.find(query, '-timestamps').lean();

        if (data.length === 0) {
            return res.status(404).json({ message: 'No data found for the given filters.' });
        }

        // Convert MongoDB data to CSV
        const fields = Object.keys(data[0]).filter(field => field !== 'timestamps'); // Exclude `timestamps` field
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(data);

        // Save the CSV file
        const filePath = path.join(__dirname, 'exports', 'individualGames.csv');
        fs.mkdirSync(path.dirname(filePath), { recursive: true }); // Ensure the directory exists
        fs.writeFileSync(filePath, csv);

        // Send the file for download
        res.download(filePath, 'individualGames.csv', (err) => {
            if (err) {
                console.error('File download error:', err);
                res.status(500).json({ error: 'Failed to download the file.' });
            }

            // Optionally, delete the file after download
            fs.unlinkSync(filePath);
        });

    } catch (error) {
        console.error('Error exporting data to CSV:', error);
        res.status(500).json({ error: 'Failed to export data to CSV.' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));