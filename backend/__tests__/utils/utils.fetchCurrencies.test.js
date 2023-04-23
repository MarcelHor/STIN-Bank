const {getCurrencies} = require('../../utils/fetchCurrencies');
const {runCron, insertCurrencies} = require('../../utils/fetchCurrencies');
const currenciesRepository = require("../../repositories/currenciesRepository")

// Mock the currenciesRepository.insertCurrency function
currenciesRepository.insertCurrency = jest.fn();

describe('getCurrencies', () => {
    test('should return an array of currencies', async () => {
        const currencies = await getCurrencies();
        expect(Array.isArray(currencies)).toBe(true);
    });

    test('should return an array of currencies with the correct properties', async () => {
        const currencies = await getCurrencies();
        const currency = currencies[0];
        expect(currency).toHaveProperty('country');
        expect(currency).toHaveProperty('currency');
        expect(currency).toHaveProperty('amount');
        expect(currency).toHaveProperty('code');
        expect(currency).toHaveProperty('rate');
    });
});

describe('insertCurrencies', () => {
    test('should call the currenciesRepository.insertCurrency function', async () => {
        await insertCurrencies();
        expect(currenciesRepository.insertCurrency).toHaveBeenCalled();
    });
});

describe('runCron', () => {
    test('should call the insertCurrencies function', async () => {
        jest.useFakeTimers('modern').setSystemTime(new Date('2022-01-01T14:35:00'));
        runCron();
        jest.advanceTimersByTime(1000);
        expect(currenciesRepository.insertCurrency).toHaveBeenCalled();
    });
});