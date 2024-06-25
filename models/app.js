const mongoose = require('mongoose')

const appSchema = new mongoose.Schema({
    appName: {
        type: String,
        required: true
    },
    gameSetId: {
        type: Number
    },
    jackpotId: {
        type: Number,
        required: true
    },
    jackpotVersion: {
        type: [String, String],
        default: ['4.0.0.0', '1']
    },
    region: {
        type: String,
        required: true
    },
    interface: {
        type: String,
        required: true
    },
    gameList: [{
        gameId: {
            type: Number,
            required: true
        },
        gameVersion: {
            type: [String, String]
        }
    }],
})

module.exports = mongoose.model('App', appSchema)