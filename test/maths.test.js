require('dotenv').config()

const request = require('supertest');
const express = require('express');
const math = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Math = require('../models/math');
const mathRouter = require('../routes/maths');

math.use(bodyParser.json());
math.use('/maths', mathRouter);

// Connect to a test database
beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Clear the database after each test
afterEach(async () => {
    await Math.deleteMany();
});

// Close the database connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});
test('Scenario 9.1', async () => {
    const newMath = {
        // mathName: 'Test Math',
        percentage: [1, 2],
        percentageSetList: [1, 2, 3]
    };
    await request(math)
        .post('/maths')
        .send(newMath)
        .then(response => {
            console.log('Response 9.1:', response.body);
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('mathName', 'Test Math');
        })
        .catch(err => {
            console.error('POST /maths error:', err);
            throw err;
        });
});
test('Scenario 9.2', async () => {
    const newMath = {
        mathName: 'Test Math',
        percentage: [1, 2],
        percentageSetList: [1, 2, 3]
    };
    await request(math)
        .post('/maths')
        .send(newMath)
        .then(response => {
            console.log('Response 9.2:', response.body);
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('mathName', 'Test Math');
        })
        .catch(err => {
            console.error('POST /maths error:', err);
            throw err;
        });
});

test('Scenario 10.1', async () => {
    const newMath = {
        mathName: 'Test Math',
        percentage: [1, 2],
        percentageSetList: [1, 2, 3]
    };

    const postResponse = await request(math)
        .post('/maths')
        .send(newMath);

    expect(postResponse.statusCode).toBe(201);
    const createdMath = postResponse.body;
    const mathId = createdMath.mathId;

    const updatedMath = {
        mathName: 'Test Math1',
        percentage: [1, 2, 3],
        percentageSetList: [1, 2, 3, 4]
    };
    const patchResponse = await request(math)
        .patch(`/maths/${mathId}`)
        .send(updatedMath);

    expect(patchResponse.statusCode).toBe(200);

    const getResponse = await request(math).get(`/maths/${mathId}`);

    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.body).toHaveProperty('mathName', 'Test Math1');
    expect(getResponse.body).toHaveProperty('percentage', [1, 2, 3]);
    expect(getResponse.body).toHaveProperty('percentageSetList', [1, 2, 3, 4]);

    console.log('Response 10.1:', postResponse.body);
});

test('Scenario 11.1', async () => {
    const response = await request(math).get('/maths');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    console.log("Response 11.1", response.body)
});

test('Scenario 12.1', async () => {
    const response = await request(math).delete('/maths');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeFalsy();
    console.log("Response 12.1", response.body)
});