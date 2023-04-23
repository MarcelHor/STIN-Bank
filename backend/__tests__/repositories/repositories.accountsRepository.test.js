const pool = require('../../config/db');
const dbFunctions = require('../../repositories/accountsRepository');

jest.mock('../../config/db', () => ({
    query: jest.fn(),
}));

describe('Database functions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAccount', () => {
        it('should return the account with the specified user and currency', async () => {
            const mockResult = [{id: 1, user: 'testUser', currency: 'USD', balance: 100}];
            pool.query.mockResolvedValueOnce(mockResult);

            const account = await dbFunctions.getAccount('testUser', 'USD');
            expect(account).toEqual(mockResult);
            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM accounts WHERE user = ? AND currency = ?', ['testUser', 'USD']);
        });
    });

    describe('getDefaultAccount', () => {
        it('should return the default account for the specified user', async () => {
            const mockResult = [{id: 1, user: 'testUser', currency: 'USD', balance: 100, isDefault: 1}];
            pool.query.mockResolvedValueOnce(mockResult);

            const account = await dbFunctions.getDefaultAccount('testUser');
            expect(account).toEqual(mockResult);
            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM accounts WHERE user = ? AND isDefault = 1', ['testUser']);
        });
    });

    describe('getCurrency', () => {
        it('should return the currency with the specified country code', async () => {
            const mockResult = [{country: 'USD', code: 'USD', symbol: '$'}];
            pool.query.mockResolvedValueOnce(mockResult);

            const currency = await dbFunctions.getCurrency('USD');
            expect(currency).toEqual(mockResult);
            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM currencies WHERE country = ?', ['USD']);
        });
    });

    describe('getAllAccounts', () => {
        it('should return all accounts for the specified user, with their respective currencies', async () => {
            const mockResult = [{
                id: 1, user: 'testUser', currency: 'USD', balance: 100, isDefault: 1, code: 'USD'
            }, {id: 2, user: 'testUser', currency: 'EUR', balance: 50, isDefault: 0, code: 'EUR'},];
            pool.query.mockResolvedValueOnce(mockResult);

            const accounts = await dbFunctions.getAllAccounts('testUser');
            expect(accounts).toEqual(mockResult);
            expect(pool.query).toHaveBeenCalledWith('select accounts.*, currencies.code\n' + '  from accounts\n' + '  join currencies on accounts.currency = currencies.country WHERE user = ?', ['testUser']);
        });
    });

    describe('deleteAccount', () => {
        it('should delete the account with the specified user and currency', async () => {
            const mockResult = {affectedRows: 1};
            pool.query.mockResolvedValueOnce(mockResult);

            const result = await dbFunctions.deleteAccount('testUser', 'USD');
            expect(result).toEqual(mockResult);
            expect(pool.query).toHaveBeenCalledWith('DELETE FROM accounts WHERE user = ? AND currency = ?', ['testUser', 'USD']);
        });
    });

    describe('addBalance', () => {
        it('should add the specified balance to the account with the specified user and currency', async () => {
            const mockResult = {affectedRows: 1};
            pool.query.mockResolvedValueOnce(mockResult);

            const result = await dbFunctions.addBalance('testUser', 'USD', 100);
            expect(result).toEqual(mockResult);
            expect(pool.query).toHaveBeenCalledWith('UPDATE accounts SET balance = balance + ? WHERE user = ? AND currency = ?', [100, 'testUser', 'USD']);
        });
    });

    describe('subtractBalance', () => {
        it('should subtract the specified balance from the account with the specified user and currency', async () => {
            const mockResult = {affectedRows: 1};
            pool.query.mockResolvedValueOnce(mockResult);

            const result = await dbFunctions.subtractBalance('testUser', 'USD', 100);
            expect(result).toEqual(mockResult);
            expect(pool.query).toHaveBeenCalledWith('UPDATE accounts SET balance = balance - ? WHERE user = ? AND currency = ?', [100, 'testUser', 'USD']);
        });
    });

    describe('insertAccount', () => {
        it('should insert a new account with the specified user, currency, balance, and default status', async () => {
            const mockResult = {insertId: 1};
            pool.query.mockResolvedValueOnce(mockResult);

            const result = await dbFunctions.insertAccount('testUser', 'USD', 100, true);
            expect(result).toEqual(mockResult);
            expect(pool.query).toHaveBeenCalledWith('INSERT INTO accounts (user, currency, balance, isDefault) VALUES (?, ?, ?, ?)', ['testUser', 'USD', 100, true]);
        });
    });
});
