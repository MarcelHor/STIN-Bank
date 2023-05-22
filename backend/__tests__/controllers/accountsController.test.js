const accountsRepository = require('../../repositories/accountsRepository');
const {
    removeAccount, addNewAccount, setDefaultAccount, sendBalance, getAllAccounts, withdrawBalance, depositBalance
} = require("../../controllers/accountsController");

jest.mock('../../repositories/accountsRepository');

describe('getAllAccounts', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returns an error if user id is not provided', async () => {
        const mockReq = {
            user: {},
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(), json: jest.fn(),
        };

        await getAllAccounts(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({message: 'User id is required'});
    });
    it('returns all accounts for a user', async () => {
        const mockAccounts = [{id: 1, accountNumber: '1234567890', currency: 'EUR', balance: 100}, {
            id: 2,
            accountNumber: '1234567890',
            currency: 'GBP',
            balance: 200
        },];
        const mockReq = {
            user: {
                accountNumber: '1234567890',
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(), json: jest.fn(),
        };
        accountsRepository.getAllAccounts.mockResolvedValue(mockAccounts);

        await getAllAccounts(mockReq, mockRes);

        expect(accountsRepository.getAllAccounts).toHaveBeenCalledWith('1234567890');
        expect(mockRes.status).toHaveBeenCalledWith(200);
    });
});

describe('removeAccount', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return an error if account does not exist', async () => {
        const mockReq = {
            user: {
                accountNumber: '1234567890',
            }, body: {
                currency: 'EUR',
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(), json: jest.fn(),
        };
        accountsRepository.getAccount.mockResolvedValue([[]]);

        await removeAccount(mockReq, mockRes);

        expect(accountsRepository.getAccount).toHaveBeenCalledWith('1234567890', 'EUR');
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'error', message: 'Account does not exist',
        });
    });
    test('should return 400 if account is default account', async () => {
        const mockReq = {
            user: {
                accountNumber: '1234567890',
            }, body: {
                currency: 'EUR',
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(), json: jest.fn(),
        };
        accountsRepository.getAccount.mockResolvedValue([[{id: 1}]]);
        accountsRepository.getDefaultAccount.mockResolvedValue([[{currency: 'EUR'}]]);

        await removeAccount(mockReq, mockRes);

        expect(accountsRepository.getAccount).toHaveBeenCalledWith('1234567890', 'EUR');
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'error', message: 'Cannot delete default account',
        });
    });
    test('removes account successfully', async () => {
        // Mock request and response objects
        const mockReq = {
            user: { id: 1 },
            body: { currency: 'USD' },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the required repository functions
        jest.spyOn(accountsRepository, 'getCurrency').mockResolvedValue([[{ exchangeRate: 1, amount: 1 }]]);
        jest.spyOn(accountsRepository, 'addBalance').mockResolvedValue();
        jest.spyOn(accountsRepository, 'deleteAccount').mockResolvedValue();

        // Call the function with mock objects
        await removeAccount(mockReq, mockRes);

        expect(accountsRepository.getCurrency).toHaveBeenCalledTimes(2);
        // Check that the response status and message are as expected
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'success',
            message: 'Account removed successfully',
        });
    });
});

describe('createAccount', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return an error if account already exists', async () => {
        const mockReq = {
            user: {
                accountNumber: '1234567890',
            }, body: {
                currency: 'EUR',
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(), json: jest.fn(),
        };
        accountsRepository.getAccount.mockResolvedValue([[{id: 1}]]);

        await addNewAccount(mockReq, mockRes);

        expect(accountsRepository.getAccount).toHaveBeenCalledWith('1234567890', 'EUR');
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'error', message: 'Account already exists',
        });
    });
});

describe('setDefaultAccount', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return an error if account does not exist', async () => {
        const mockReq = {
            user: {
                accountNumber: '1234567890',
            }, body: {
                currency: 'EUR',
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(), json: jest.fn(),
        };
        accountsRepository.getAccount.mockResolvedValue([[]]);

        await setDefaultAccount(mockReq, mockRes);

        expect(accountsRepository.getAccount).toHaveBeenCalledWith('1234567890', 'EUR');
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'error', message: 'Account does not exist',
        });
    });
    it('should set the default account', async () => {
        const mockReq = {
            user: {
                accountNumber: '1234567890',
            },
            body: {
                currency: 'EUR',
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(), json: jest.fn(),
        };
        accountsRepository.getAccount.mockResolvedValue([[{id: 1}]]);
        accountsRepository.setDefaultAccount.mockResolvedValue([[]]);

        await setDefaultAccount(mockReq, mockRes);

        expect(accountsRepository.setDefaultAccount).toHaveBeenCalledWith('1234567890', 'EUR');
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'success', message: 'Default account set successfully',
        });
    });
});
//
// describe('sendBalance', () => {
//     afterEach(() => {
//         jest.clearAllMocks();
//     });
//
//     it('should return an error if account does not exist', async () => {
//         const mockReq = {
//             user: {
//                 accountNumber: '1234567890',
//             }, body: {
//                 currency: 'EUR',
//             },
//         };
//         const mockRes = {
//             status: jest.fn().mockReturnThis(), json: jest.fn(),
//         };
//         accountsRepository.getAccount.mockResolvedValue([[]]);
//
//         await sendBalance(mockReq, mockRes);
//
//         expect(accountsRepository.getAccount).toHaveBeenCalledWith('1234567890', 'EUR');
//         expect(mockRes.status).toHaveBeenCalledWith(400);
//         expect(mockRes.json).toHaveBeenCalledWith({
//             status: 'error', message: 'Account does not exist',
//         });
//     });
//     it('should return an error if account balance is less than the amount to send', async () => {
//         const mockReq = {
//             user: {
//                 accountNumber: '1234567890',
//             }, body: {
//                 currency: 'EUR', balance: 100,
//             },
//         };
//         const mockRes = {
//             status: jest.fn().mockReturnThis(), json: jest.fn(),
//         };
//         accountsRepository.getAccount.mockResolvedValue([[{balance: 50}]]);
//
//         await sendBalance(mockReq, mockRes);
//
//         expect(accountsRepository.getAccount).toHaveBeenCalledWith('1234567890', 'EUR');
//         expect(mockRes.status).toHaveBeenCalledWith(400);
//         expect(mockRes.json).toHaveBeenCalledWith({
//             status: 'error', message: 'Insufficient funds',
//         });
//     });
// });

describe('withdrawBalance', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return an error if account does not exist', async () => {
        const mockReq = {
            user: {
                accountNumber: '1234567890',
            }, body: {
                currency: 'EUR',
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(), json: jest.fn(),
        };
        accountsRepository.getAccount.mockResolvedValue([[]]);

        await withdrawBalance(mockReq, mockRes);

        expect(accountsRepository.getAccount).toHaveBeenCalledWith('1234567890', 'EUR');
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'error', message: 'Account does not exist',
        });
    });
    it('should return an error if account balance is less than the amount to withdraw', async () => {
        const mockReq = {
            user: {
                accountNumber: '1234567890',
            }, body: {
                currency: 'EUR', balance: 200,
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(), json: jest.fn(),
        };
        accountsRepository.getAccount.mockResolvedValue([[{balance: 100}]]);

        await withdrawBalance(mockReq, mockRes);

        expect(accountsRepository.getAccount).toHaveBeenCalledWith('1234567890', 'EUR');
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 'error', message: 'Insufficient funds',
        });
    });
});
