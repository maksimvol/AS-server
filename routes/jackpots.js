const express = require('express')
const router = express.Router()
const Jackpot = require('../models/jackpot')

// Getting All
router.get('/', async (req, res) => {
    try {
        const jackpots = await Jackpot.find()
        res.json(jackpots)
        console.log(jackpots)
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

// Getting One
router.get('/:id', getJackpot, (req, res) => {
    res.json(res.jackpot)
})

// Creating One
router.post('/', async (req, res) => {
    try {
        // Find Maximum Jackpots Id
        const maxId = await Jackpot.findOne().sort({ jackpotId: -1 })
        let newJackpotId = 1
        if (maxId && maxId.jackpotId) {
            newJackpotId = maxId.jackpotId + 1
        }
        // Check if System Id exists
        const existingJackpotId = await Jackpot.findOne({ jackpotId: req.body.jackpotId})
        if(existingJackpotId && req.body.jackpotId >= 0) {
            // Can add negative system Id for future sorting
            return res.status(400).json({ message: 'System Id Already exists!'})
        }
        // Check if Jackpot Name exists
        const existingJackpotName = await Jackpot.findOne({ jackpotName: req.body.jackpotName })
        if (existingJackpotName && existingJackpotName.jackpotName.toLowerCase() === req.body.jackpotName.toLowerCase()) {
            return res.status(400).json({ message: 'Jackpot Name Already exists!' })
        }

        const jackpot = new Jackpot({
            jackpotName: req.body.jackpotName,
            jackpotId: newJackpotId,
            jackpotType: req.body.jackpotType,
            percentageSetList: req.body.percentageSetList,
        })
        const newJackpot = await jackpot.save()
        res.status(201).json(newJackpot)
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})

// Updating One
router.patch('/:id', getJackpot, async (req, res) => {
    try {
        for (const [key] of Object.entries(req.body)) {
            if (res.jackpot[key] != null){
                res.jackpot[key] = req.body[key]
            }
        }

        const updatedJackpot = await res.jackpot.save()

        res.json(updatedJackpot)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Deleting One
router.delete('/:id', getJackpot, async (req, res) => {
    try {        
        await res.jackpot.deleteOne()
        res.json({ message: 'Deleted Jackpot' })
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

// Deleting All
router.delete('/', async (req, res) => {
    try {
        await Jackpot.deleteMany({})
        res.json({ message: 'All jackpots deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get Jackpot By Id
async function getJackpot(req, res, next) {
    let jackpot
    try {
        jackpot = await Jackpot.findOne({ jackpotId: req.params.id })
        if(jackpot == null) {
            return res.status(404).json({ message: 'Cannot Find Jackpot'})
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.jackpot = jackpot
    next()
}

module.exports = router