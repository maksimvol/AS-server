const express = require('express')
const router = express.Router()
const App = require('../models/app')

// Getting All
router.get('/', async (req, res) => {
    try {
        const apps = await App.find()
        res.json(apps)
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

// Getting One
router.get('/:id', getApp, (req, res) => {
    res.json(res.app)
})

// Creating One
router.post('/', async (req, res) => {

    try {
        // Find Maximum App Id
        const maxId = await App.findOne().sort({ gameSetId: -1 })
        let newAppId = 1
        if (maxId && maxId.gameSetId) {
            newAppId = maxId.gameSetId + 1
        }

        // Check if App Name exists
        const existingAppName = await App.findOne({ appName: req.body.appName });
        if (existingAppName && existingAppName.appName.toLowerCase() === req.body.appName.toLowerCase()) {
            return res.status(400).json({ message: 'App Name Already exists!' });
        }
        console.log("temp", req.body.gameList) 
        const app = new App({
            appName: req.body.appName,
            gameSetId: newAppId,
            jackpotId: req.body.jackpotId,
            jackpotVersion: req.body.jackpotVersion,
            region: req.body.region,
            interface: req.body.interface,
            gameList: req.body.gameList,
        })
        const newApp = await app.save()
        res.status(201).json(newApp)
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})

// Updating One
router.patch('/:id', getApp, async (req, res) => {
    if (req.body.appName != null) {
        res.app.appName = req.body.name
    }
    try {
        const updatedApp = await res.app.save()
        res.json(updatedApp)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Deleting One
router.delete('/:id', getApp, async (req, res) => {
    try {        
        await res.app.deleteOne()
        res.json({ message: 'Deleted App' })
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

// Deleting All
router.delete('/', async (req, res) => {
    try {
        await App.deleteMany({})
        res.json({ message: 'All apps deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get App By Id
async function getApp(req, res, next) {
    let app
    try {
        app = await App.findOne({ gameSetId: req.params.id })
        if(app == null) {
            return res.status(404).json({ message: 'Cannot Find App'})
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.app = app
    next()
}

module.exports = router