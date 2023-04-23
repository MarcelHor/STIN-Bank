const dbFunctions = require('../../repositories/authRepository');
const pool = require('../../config/db');

jest.mock('../../config/db', () => ({
    query: jest.fn(),
}));

describe('authRepository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findUserByEmail', () => {
        it('should call pool.query with the correct SQL statement and arguments', async () => {
            const email = 'test@example.com';

            await dbFunctions.findUserByEmail(email);

            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = ?', [email]);
        });
    });

    describe('createUser', () => {
        it('should call pool.query with the correct SQL statement and arguments', async () => {
            const firstName = 'John';
            const lastName = 'Doe';
            const passwordHash = 'hash123';
            const email = 'test@example.com';
            const accountNumber = '123456';

            await dbFunctions.createUser(firstName, lastName, passwordHash, email, accountNumber);

            expect(pool.query).toHaveBeenCalledWith(
                'INSERT INTO users (firstName, lastName, passwordHash, email, accountNumber) VALUES (?, ?, ?, ?, ?)',
                [firstName, lastName, passwordHash, email, accountNumber],
            );
        });
    });

    describe('createTwoFactorAuthCode', () => {
        it('should call pool.query with the correct SQL statement and arguments', async () => {
            const email = 'test@example.com';
            const code = '123456';

            await dbFunctions.createTwoFactorAuthCode(email, code);

            expect(pool.query).toHaveBeenCalledWith('INSERT INTO two_factor_auth (email, code) VALUES (?, ?)', [email, code]);
        });
    });

    describe('findTwoFactorAuthCode', () => {
        it('should call pool.query with the correct SQL statement and arguments', async () => {
            const email = 'test@example.com';

            await dbFunctions.findTwoFactorAuthCode(email);

            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM two_factor_auth WHERE email = ?', [email]);
        });
    });

    describe('deleteTwoFactorAuthCode', () => {
        it('should call pool.query with the correct SQL statement and arguments', async () => {
            const email = 'test@example.com';

            await dbFunctions.deleteTwoFactorAuthCode(email);

            expect(pool.query).toHaveBeenCalledWith('DELETE FROM two_factor_auth WHERE email = ?', [email]);
        });
    });
});
