const currenciesController = require('../../controllers/currenciesController');
const currenciesRepository = require('../../repositories/currenciesRepository');

describe('getAllCurrencies', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return all currencies', async () => {
        const mockReq = {};
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const mockResult = [{ id: 1, name: 'USD' }, { id: 2, name: 'EUR' }];

        jest.spyOn(currenciesRepository, 'getAllCurrencies').mockResolvedValue([mockResult]);

        await currenciesController.getAllCurrencies(mockReq, mockRes);

        expect(currenciesRepository.getAllCurrencies).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    test('should return a server error', async () => {
        const mockReq = {};
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(currenciesRepository, 'getAllCurrencies').mockRejectedValue(new Error('Server error'));

        await currenciesController.getAllCurrencies(mockReq, mockRes);

        expect(currenciesRepository.getAllCurrencies).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ status: 'error', message: 'Server error' });
    });
});
