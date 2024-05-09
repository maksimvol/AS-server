require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

// Games Router
const gamesRouter = require('./routes/games')
app.use('/games', gamesRouter)
// Apps Router
const appsRouter = require('./routes/apps')
app.use('/apps', appsRouter)
// Jackpot Router

// Math Router

app.listen(3000, () => console.log('Server Started'))