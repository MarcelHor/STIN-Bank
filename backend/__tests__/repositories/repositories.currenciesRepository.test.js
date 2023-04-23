const currenciesRepository = require('../../repositories/currenciesRepository');
jest.mock('../../config/db', () => ({
    query: jest.fn(),
}));
const pool = require('../../config/db');

describe('currenciesRepository', () => {
    test('getAllCurrencies should query the database for all currencies', async () => {
        // Set up the mock implementation of pool.query()
        const expectedResult = [{id: 1, name: 'USD'}, {id: 2, name: 'EUR'}];
        pool.query.mockResolvedValueOnce(expectedResult);

        // Call the function under test
        const result = await currenciesRepository.getAllCurrencies();

        // Check the result
        expect(result).toEqual(expectedResult);

        // Check that pool.query() was called with the expected SQL statement
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM currencies');
    });

    test('insertCurrency should insert a currency into the database', async () => {
        const currency = {
            currency: 'Bitcoin',
            amount: 2.5,
            code: 'BTC',
            rate: 50000,
            country: 'N/A'
        };
        const expectedQuery = "INSERT INTO currencies (name, amount, code, exchangeRate, country) \n" +
            "VALUES (?, ?, ?, ?, ?) \n" +
            "ON DUPLICATE KEY UPDATE \n" +
            "    name = VALUES(name), \n" +
            "    amount = VALUES(amount), \n" +
            "    code = VALUES(code), \n" +
            "    exchangeRate = VALUES(exchangeRate);";
        pool.query.mockResolvedValueOnce({ affectedRows: 1 });
        await currenciesRepository.insertCurrency(currency);
        expect(pool.query).toHaveBeenCalledWith(expectedQuery, [currency.currency, currency.amount, currency.code, currency.rate, currency.country]);
    });
});
