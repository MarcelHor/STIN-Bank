const bcrypt = require('bcrypt');
const authFunctions = require('../../utils/authFunctions');
const authRepository = require('../../repositories/authRepository');
const authController = require('../../controllers/authController');

jest.mock('bcrypt');
jest.mock('../../utils/authFunctions');
jest.mock('../../repositories/authRepository');


describe('login', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('returns 400 if input is invalid', async () => {
        const mockReq = {
            body: {
                email: 'asdsad', password: '12',
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(), json: jest.fn(),
        };

        await authController.login(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({message: 'Invalid password'});
    });
    test('returns token if input is valid', async () => {
        const mockReq = {
            body: {
                email: 'test@example.com',
                password: 'password123',
            },
        };
        const mockUser = {
            email: 'test@example.com',
            passwordHash: 'hashedPassword',
        };
        const mockTwoFactorCode = {
            code: '123456',
            created_at: new Date(),
        };
        const mockToken = 'mockToken';

        jest.spyOn(authRepository, 'findUserByEmail').mockResolvedValue([[mockUser]]);
        jest.spyOn(authRepository, 'findTwoFactorAuthCode').mockResolvedValue([[mockTwoFactorCode]]);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
        jest.spyOn(authFunctions, 'sendMail').mockResolvedValue();
        jest.spyOn(authFunctions, 'generateToken').mockReturnValue(mockToken);

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await authController.login(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
    });
    test('returns 401 if password is invalid', async () => {
        const mockReq = {
            body: {
                email: 'test@example.com',
                password: 'password123',
            },
        };
        const mockUser = {
            email: 'test@example.com',
            passwordHash: 'hashedPassword',
        };
        const mockTwoFactorCode = {
            code: '123456',
            created_at: new Date(),
        };

        jest.spyOn(authRepository, 'findUserByEmail').mockResolvedValue([[mockUser]]);
        jest.spyOn(authRepository, 'findTwoFactorAuthCode').mockResolvedValue([[mockTwoFactorCode]]);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await authController.login(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({message: 'Invalid password'});
    });
});

describe('register', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('returns 409 if user already exists', async () => {
        const mockReq = {
            body: {
                    email: 'test@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                    password: 'password123',

            }
        };
        const mockUser = {
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123',
        }

        jest.spyOn(authRepository, 'createUser').mockResolvedValue(mockUser);

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }

        await authController.register(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(409);
        expect(mockRes.json).toHaveBeenCalledWith('User already exists');
    });
});
