const request = require('supertest');
const app = require('../../app');

describe('GET /api/currencies', () => {
    test('returns a currencies object', async () => {
        const response = await request(app)
            .get('/api/currencies/');
        expect(response.status).toBe(200);
    });
});
