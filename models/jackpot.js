const mongoose = require('mongoose')

const jackpotSchema = new mongoose.Schema({
    jackpotName: {
        type: String,
        required: true
    },
    jackpotId: {
        type: Number,
    },
    jackpotType: {
        type: [String],
        required: true
    },
    percentageSetList: {
        type: [Number],
        required: true
    },
    gameList: {
        type: [Number],
        required: true
    },
    jackpotAdded: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Jackpot', jackpotSchema)