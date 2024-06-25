require('dotenv').config()

const request = require('supertest');
const express = require('express');
const game = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Game = require('../models/game');
const gameRouter = require('../routes/games');

game.use(bodyParser.json());
game.use('/games', gameRouter);

// Connect to a test database
beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Clear the database after each test
afterEach(async () => {
    await Game.deleteMany();
});

// Close the database connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});
test('Scenario 5.1', async () => {
    const newGame = {
        // gameName: 'Test Game',
        // systemId: 1,
        // maxWLCMain: 10000,
        // maxWLCFreegames: 20000,
        // freegames: true,
        // gamble: true,
        // jackpot: false,
        // mathId: 1
    };
    await request(game)
        .post('/games')
        .send(newGame)
        .then(response => {
            console.log('Response 5.1:', response.body);
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('gameName', 'Test Game');
        })
        .catch(err => {
            console.error('POST /games error:', err);
            throw err;
        });
});
test('Scenario 5.2', async () => {
    const newGame = {
        gameName: 'Test Game',
        systemId: 1,
        maxWLCMain: 10000,
        maxWLCFreegames: 20000,
        freegames: true,
        gamble: true,
        jackpot: false,
        mathId: 1
    };
    await request(game)
        .post('/games')
        .send(newGame)
        .then(response => {
            console.log('Response 5.2:', response.body);
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('gameName', 'Test Game');
        })
        .catch(err => {
            console.error('POST /games error:', err);
            throw err;
        });
});

test('Scenario 6.1', async () => {
    const newGame = {
        gameName: 'Test Game',
        systemId: 1,
        maxWLCMain: 10000,
        maxWLCFreegames: 20000,
        freegames: true,
        gamble: true,
        jackpot: false,
        mathId: 1
    };

    const postResponse = await request(game)
        .post('/games')
        .send(newGame);

    expect(postResponse.statusCode).toBe(201);
    const createdGame = postResponse.body;
    const gameId = createdGame.gameId;

    const updatedGame = {
        gameName: 'Test Game1',
        systemId: 2,
        maxWLCMain: 20000,
        maxWLCFreegames: 30000,
        freegames: true,
        gamble: true,
        jackpot: false,
        mathId: 2
    };
    const patchResponse = await request(game)
        .patch(`/games/${gameId}`)
        .send(updatedGame);

    expect(patchResponse.statusCode).toBe(200);

    const getResponse = await request(game).get(`/games/${gameId}`);

    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.body).toHaveProperty('gameName', 'Test Game1');
    expect(getResponse.body).toHaveProperty('systemId', 2);
    expect(getResponse.body).toHaveProperty('maxWLCMain', 20000);
    expect(getResponse.body).toHaveProperty('maxWLCFreegames', 30000);
    expect(getResponse.body).toHaveProperty('freegames', true);
    expect(getResponse.body).toHaveProperty('gamble', true);
    expect(getResponse.body).toHaveProperty('jackpot', false);
    expect(getResponse.body).toHaveProperty('mathId', 2);

    console.log('Response 6.1:', postResponse.body);
});

test('Scenario 7.1', async () => {
    const response = await request(game).get('/games');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    console.log("Response 7.1", response.body)
});

test('Scenario 8.1', async () => {
    const response = await request(game).delete('/games');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeFalsy();
    console.log("Response 8.1", response.body)
});