const request = require('supertest');
const app = require('../../app');
const userRepository = require('../../repositories/userRepository');
const jwt = require('jsonwebtoken');

// In your test setup function, create a test token
const token = jwt.sign({ accountNumber: 1 }, process.env.ACCESS_TOKEN_SECRET);

describe('GET /api/user', () => {
    test('returns a user object when authenticated', async () => {
        const mockUser = { id: 1, name: 'John Doe' };

        // Mock the userRepository.getUser method
        userRepository.getUser = jest.fn().mockResolvedValue(mockUser);

        // Make a request to the route with the valid JWT token
        const response = await request(app)
            .get('/api/user')
            .set('Authorization', `Bearer ${token}`);

        // Check that the response is 200 OK
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });



    test('returns an error when not authenticated', async () => {
        const response = await request(app).get('/api/user');

        expect(response.status).toBe(401);
        expect(response.text).toBe('Access denied');
    });

});