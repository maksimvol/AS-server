const express = require('express')
const router = express.Router()
const Math = require('../models/math')

// Getting All
router.get('/', async (req, res) => {
    try {
        const maths = await Math.find()
        res.json(maths)
        console.log(maths)
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

// Getting One
router.get('/:id', getMath, (req, res) => {
    res.json(res.math)
    console.log(res.math)
})

// Creating One
router.post('/', async (req, res) => {
    try {
        // Find Maximum Math Id
        const maxId = await Math.findOne().sort({ mathId: -1 })
        let newMathId = 1
        if (maxId && maxId.mathId) {
            newMathId = maxId.mathId + 1
        }
        // Check if Math Id exists
        const existingMathId = await Math.findOne({ mathId: req.body.mathId})
        if(existingMathId && req.body.mathId >= 0) {
            // Can add negative math Id for future sorting
            return res.status(400).json({ message: 'System Id Already exists!'})
        }
        // Check if Math Name exists
        const existingMathName = await Math.findOne({ mathName: req.body.mathName })
        if (existingMathName && existingMathName.mathName.toLowerCase() === req.body.mathName.toLowerCase()) {
            return res.status(400).json({ message: 'Math Name Already exists!' })
        }

        const math = new Math({
            mathName: req.body.mathName,
            mathId: newMathId,
            percentage: req.body.percentage,
            percentageSetList: req.body.percentageSetList
        })
        const newMath = await math.save()
        res.status(201).json(newMath)
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})

// Updating One
router.patch('/:id', getMath, async (req, res) => {
    try {
        for (const [key] of Object.entries(req.body)) {
            if (res.math[key] != null){
                res.math[key] = req.body[key]
            }
        }

        const updatedMath = await res.math.save()

        res.json(updatedMath)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Deleting One
router.delete('/:id', getMath, async (req, res) => {
    try {        
        await res.math.deleteOne()
        res.json({ message: 'Deleted Math' })
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

// Deleting All
router.delete('/', async (req, res) => {
    try {
        await Math.deleteMany({})
        res.json({ message: 'All maths deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get Math By Id
async function getMath(req, res, next) {
    console.log("get by id ", typeof req.params.id)
    let math
    try {
        math = await Math.findOne({ mathId: req.params.id })
        if(math == null) {
            return res.status(404).json({ message: 'Cannot Find Math'})
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.math = math
    next()
}

module.exports = router