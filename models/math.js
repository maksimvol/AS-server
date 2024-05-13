const mongoose = require('mongoose')

const mathSchema = new mongoose.Schema({
    mathName: {
        type: String,
        required: true
    },
    mathId: {
        type: Number
    },
    percentage: {
        type: [Number],
        required: true
    },
    percentageSetList: {
        type: [Number],
        required: true
    },
    mathAdded: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Math', mathSchema)