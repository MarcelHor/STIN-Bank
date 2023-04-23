const pool = require('../../config/db');
const dbFunctions = require('../../repositories/userRepository');
jest.mock('../../config/db', () => ({
    query: jest.fn(),
}));

describe('getUser', () => {
    it('should return the user with the specified id', async () => {
        const mockResult = [{ id: 1, name: 'testUser', accountNumber: 12345 }];
        pool.query.mockResolvedValueOnce(mockResult);

        const user = await dbFunctions.getUser(12345);
        expect(user).toEqual(mockResult[0]);
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE accountNumber = ?', [12345]);
    });
});
