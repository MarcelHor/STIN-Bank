const app = require('../../app');
const request = require('supertest');
require('dotenv').config();

describe('POST /api/login', () => {
    test('returns a token when authenticated', async () => {
        const response = await request(app).post('/api/login').send({
            email: 'test@example.com', password: 'test123'
        });
        expect(response.status).toBe(200);
    });
    test('returns an error when not validated', async () => {
        const response = await request(app).post('/api/login');
        expect(response.status).toBe(400);
        expect(response.text).toBe("{\"message\":\"Invalid password\"}");
    });
    test('returns an error when invalid password', async () => {
        const response = await request(app).post('/api/login').send({
            email: 'test@example.com', password: 'test1234'
        });
        expect(response.status).toBe(401);
        expect(response.text).toBe("{\"message\":\"Invalid password\"}");
    });
    test('returns an error when user does not exist', async () => {
        const response = await request(app).post('/api/login').send({
            email: 'doesnotexist@example.com', password: 'test123'
        });
        expect(response.status).toBe(401);
        expect(response.text).toBe("{\"message\":\"User does not exist\"}");
    });
});

describe('POST /api/register', () => {
    test('returns a 201 when user is created', async () => {

    });
    test('returns a 400 when input is not validated', async () => {
        const response = await request(app).post('/api/register');
        expect(response.status).toBe(400);
    });
    test('returns a 409 when user already exists', async () => {
        const response = await request(app).post('/api/register').send({
            firstName: 'Test', lastName: 'User', password: 'test123', email: 'test@example.com'
        });
        expect(response.status).toBe(409);
    });
});

describe('POST /api/verify', () => {
    test('returns a 200 when code is valid', async () => {

    });
    test('returns a 401 when code is not valid', async () => {

    });
    test('returns a 500 when other error', async () => {

    });
});