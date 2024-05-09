const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    gameName: {
        type: String,
        required: true
    },
    gameId: {
        type: Number
    },
    systemId: {
        type: Number,
        required: true
    },
    maxWLCMain: {
        type: Number,
        required: true
    },
    maxWLCFreegames: {
        type: Number,
        required: true
    },
    freegames: {
        type: Boolean,
        required: true
    },
    gamble: {
        type: Boolean,
        required: true
    },
    jackpot: {
        type: Boolean,
        required: true
    },
    gameVersion: {
        type: [String, String],
        default: ['1.0', '1']
    },
    mathId: {
        type: Number,
        required: true
    },
    gameAdded: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Game', gameSchema)