const express = require('express')
const router = express.Router()
const Game = require('../models/game')

// Getting All
router.get('/', async (req, res) => {
    try {
        const games = await Game.find()
        res.json(games)
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

// Getting One
router.get('/:id', getGame, (req, res) => {
    res.json(res.game)
})

// Creating One
router.post('/', async (req, res) => {
    try {
        // Find Maximum Game Id
        const maxId = await Game.findOne().sort({ gameId: -1 })
        let newGameId = 1
        if (maxId && maxId.gameId) {
            newGameId = maxId.gameId + 1
        }
        // Check if System Id exists
        const existingGameId = await Game.findOne({ systemId: req.body.systemId})
        if(existingGameId && req.body.systemId >= 0) {
            // Can add negative system Id for future sorting
            return res.status(400).json({ message: 'System Id Already exists!'})
        }
        // Check if Game Name exists
        const existingGameName = await Game.findOne({ gameName: req.body.gameName })
        if (existingGameName && existingGameName.gameName.toLowerCase() === req.body.gameName.toLowerCase()) {
            return res.status(400).json({ message: 'Game Name Already exists!' })
        }

        const game = new Game({
            gameName: req.body.gameName,
            gameId: newGameId,
            systemId: req.body.systemId,
            maxWLCMain: req.body.maxWLCMain,
            maxWLCFreegames: req.body.maxWLCFreegames,
            freegames: req.body.freegames,
            gamble: req.body.gamble,
            jackpot: req.body.jackpot,
            mathId: req.body.mathId
        })
        const newGame = await game.save()
        res.status(201).json(newGame)
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})

// Updating One
router.patch('/:id', getGame, async (req, res) => {
    if (req.body.gameName != null) {
        res.game.gameName = req.body.gameName;
    }
    if (req.body.maxWLCMain != null) {
        res.game.maxWLCMain = req.body.maxWLCMain;
    }
    if (req.body.maxWLCFreegames != null) {
        res.game.maxWLCFreegames = req.body.maxWLCFreegames;
    }
    if (req.body.freegames != null) {
        res.game.freegames = req.body.freegames;
    }
    if (req.body.gamble != null) {
        res.game.gamble = req.body.gamble;
    }
    if (req.body.jackpot != null) {
        res.game.jackpot = req.body.jackpot;
    }
    try {
        const updatedGame = await res.game.save();
        res.json(updatedGame);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Deleting One
router.delete('/:id', getGame, async (req, res) => {
    try {        
        await res.game.deleteOne()
        res.json({ message: 'Deleted Game' })
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

// Deleting All
router.delete('/', async (req, res) => {
    try {
        await Game.deleteMany({})
        res.json({ message: 'All games deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get Game By Id
async function getGame(req, res, next) {
    let game
    try {
        game = await Game.findOne({ gameId: req.params.id })
        if(game == null) {
            return res.status(404).json({ message: 'Cannot Find Game'})
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.game = game
    next()
}

module.exports = router