const userRepository = require('../../repositories/userRepository');
const { getUser } = require('../../controllers/userController');

describe('getUser', () => {
    test('returns user data with status code 200', async () => {
        const mockUser = {id: 1, name: 'John Doe'};
        const mockReq = {
            user: {accountNumber: 1},
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        userRepository.getUser = jest.fn().mockResolvedValue(mockUser);

        await getUser(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockUser);
        expect(userRepository.getUser).toHaveBeenCalledWith(1);
    });
});
