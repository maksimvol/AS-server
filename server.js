require('dotenv').config()

const express = require('express');
const app = express();
const port = 3001
const mongoose = require('mongoose');
const cors = require("cors");

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())
app.use(cors());

// Games Router
const gamesRouter = require('./routes/games')
app.use('/games', gamesRouter)
// Apps Router
const appsRouter = require('./routes/apps')
app.use('/apps', appsRouter)
// Jackpot Router
const jackpotsRouter = require('./routes/jackpots')
app.use('/jackpots', jackpotsRouter)
// Math Router
const mathsRouter = require('./routes/maths')
app.use('/maths', mathsRouter)

app.listen(port, () => console.log('Server Started On Port', port))