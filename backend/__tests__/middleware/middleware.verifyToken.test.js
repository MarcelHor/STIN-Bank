const { verifyToken } = require('../../middleware/verifyToken');
require('dotenv').config();
const jwt = require('jsonwebtoken');

describe('verifyToken middleware', () => {
    test('should respond with status 401 and "Access denied" message if no token provided', async () => {
        const req = { headers: {} };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        const next = jest.fn();

        await verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith('Access denied');
        expect(next).not.toHaveBeenCalled();
    });
    test('should respond with status 400 and "Invalid token" message if invalid token provided', async () => {
        const req = { headers: { authorization: 'Bearer invalidtoken' } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        const next = jest.fn();

        await verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Invalid token');
        expect(next).not.toHaveBeenCalled();
    });

    test('should call next if valid token provided', async () => {
        const token = jwt.sign({ id: '123' }, process.env.ACCESS_TOKEN_SECRET);
        const req = { headers: { authorization: `Bearer ${token}` } };
        const res = { status: jest.fn(), send: jest.fn() };
        const next = jest.fn();

        await verifyToken(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
        expect(req.user.id).toBe('123');
    });
});
