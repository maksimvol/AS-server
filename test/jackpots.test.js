require('dotenv').config()

const request = require('supertest');
const express = require('express');
const jackpot = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Jackpot = require('../models/jackpot');
const jackpotRouter = require('../routes/jackpots');

jackpot.use(bodyParser.json());
jackpot.use('/jackpots', jackpotRouter);

// Connect to a test database
beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Clear the database after each test
afterEach(async () => {
    await Jackpot.deleteMany();
});

// Close the database connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});
test('Scenario 13.1', async () => {
    const newJackpot = {
        // jackpotName: 'Test Jackpot',
        // jackpotType: 'Test Type',
        percentageSetList: [1, 2, 3]
    };
    await request(jackpot)
        .post('/jackpots')
        .send(newJackpot)
        .then(response => {
            console.log('Response 13.1:', response.body);
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('jackpotName', 'Test Jackpot');
        })
        .catch(err => {
            console.error('POST /jackpots error:', err);
            throw err;
        });
});
test('Scenario 13.2', async () => {
    const newJackpot = {
        jackpotName: 'Test Jackpot',
        jackpotType: 'Test Type',
        percentageSetList: [1, 2, 3]
    };
    await request(jackpot)
        .post('/jackpots')
        .send(newJackpot)
        .then(response => {
            console.log('Response 13.2:', response.body);
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('jackpotName', 'Test Jackpot');
        })
        .catch(err => {
            console.error('POST /jackpots error:', err);
            throw err;
        });
});

test('Scenario 14.1', async () => {
    const newJackpot = {
        jackpotName: 'Test Jackpot',
        jackpotType: 'Test Type',
        percentageSetList: [1, 2, 3]
    };

    const postResponse = await request(jackpot)
        .post('/jackpots')
        .send(newJackpot);

    expect(postResponse.statusCode).toBe(201);
    const createdJackpot = postResponse.body;
    const jackpotId = createdJackpot.jackpotId;

    const updatedJackpot = {
        jackpotName: 'Test Jackpot1',
        jackpotType: 'Test Type1',
        percentageSetList: [1, 2, 3, 4]
    };
    const patchResponse = await request(jackpot)
        .patch(`/jackpots/${jackpotId}`)
        .send(updatedJackpot);

    expect(patchResponse.statusCode).toBe(200);

    const getResponse = await request(jackpot).get(`/jackpots/${jackpotId}`);

    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.body).toHaveProperty('jackpotName', 'Test Jackpot1');
    expect(getResponse.body).toHaveProperty('jackpotType', 'Test Type1');
    expect(getResponse.body).toHaveProperty('percentageSetList', [1, 2, 3, 4]);

    console.log('Response 14.1:', postResponse.body);
});

test('Scenario 15.1', async () => {
    const response = await request(jackpot).get('/jackpots');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    console.log("Response 15.1", response.body)
});

test('Scenario 16.1', async () => {
    const response = await request(jackpot).delete('/jackpots');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeFalsy();
    console.log("Response 16.1", response.body)
});