require('dotenv').config()

const request = require('supertest');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const App = require('../models/app');
const appsRouter = require('../routes/apps');

app.use(bodyParser.json());
app.use('/apps', appsRouter);

// Connect to a test database
beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Clear the database after each test
afterEach(async () => {
    await App.deleteMany();
});

// Close the database connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});
test('Scenario 1.1', async () => {
    const newApp = {
        // appName: 'Test App',
        // jackpotId: '123',
        jackpotVersion: ['4.0.0.0', '1'],
        // region: 'US',
        // interface: 'Web',
        gameList: {
            // gameId: 1, 
            gameVersion: ['1.0.0.0', '1']
        }
    };
    await request(app)
        .post('/apps')
        .send(newApp)
        .then(response => {
            console.log('Response 1.1:', response.body);
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('appName', 'Test App');
        })
        .catch(err => {
            console.error('POST /apps error:', err);
            throw err;
        });
});
test('Scenario 1.2', async () => {
    const newApp = {
        appName: 'Test App',
        jackpotId: 1,
        jackpotVersion: ['4.0.0.0', '1'],
        region: 'Latvia',
        interface: 'Web',
        gameList: [
            {
                gameId: 1, gameVersion: ['1.0.0.0', '1']
            }
        ]
    };
    await request(app)
        .post('/apps')
        .send(newApp)
        .then(response => {
            console.log('Response 1.2:', response.body);
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('appName', 'Test App');
        })
        .catch(err => {
            console.error('POST /apps error:', err);
            throw err;
        });
});

test('Scenario 2.1', async () => {
    const newApp = {
        appName: 'testApp2',
        jackpotId: 1,
        jackpotVersion: '1.0.0.0',
        region: 'Latvia',
        interface: 'Web',
        gameList: [
            {
                gameId: 1,
                gameVersion: ['1.0.0.0', '1']
            }
        ]
    };

    const postResponse = await request(app)
        .post('/apps')
        .send(newApp);

    expect(postResponse.statusCode).toBe(201);
    const createdApp = postResponse.body;
    const appId = createdApp.gameSetId;

    const updatedApp = {
        appName: 'testApp1',
        jackpotId: 1,
        jackpotVersion: ['1.0.0.0', '1'],
        region: 'Latvia',
        interface: 'Interface1',
        gameList: [
            {
                gameId: 1,
                gameVersion: ['1.0.0.0', '1']
            }
        ]
    };
    const patchResponse = await request(app)
        .patch(`/apps/${appId}`)
        .send(updatedApp);

    expect(patchResponse.statusCode).toBe(200);

    const getResponse = await request(app).get(`/apps/${appId}`);

    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.body).toHaveProperty('appName', 'testApp1');
    expect(getResponse.body).toHaveProperty('jackpotId', 1);
    expect(getResponse.body).toHaveProperty('region', 'Latvia');
    expect(getResponse.body).toHaveProperty('interface', 'Interface1');
    expect(getResponse.body).toHaveProperty('gameList', 1, ['1.0.0.0', '1']);

    console.log('Response 2.1:', postResponse.body);
});

test('Scenario 3.1', async () => {
    const response = await request(app).get('/apps');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    console.log("Response 3.1", response.body)
});

test('Scenario 4.1', async () => {
    const response = await request(app).delete('/apps');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeFalsy();
    console.log("Response 4.1", response.body)
});