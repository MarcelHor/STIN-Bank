const pool = require('../../config/db');
const dbFunctions = require('../../repositories/transactionRepository');
jest.mock('../../config/db', () => ({
    query: jest.fn(),
}));

describe('Database functions', () => {
    describe('allTransactions', () => {
        it('should return all transactions for a user within a limit and offset', async () => {
            // Mock the pool.query function
            const mockQuery = jest.fn().mockResolvedValueOnce([{
                id: 1,
                from_account: 123,
                to_account: 456,
                from_currency: 'USD',
                to_currency: 'EUR',
                amount: 100,
                operation: 'send'
            }]);
            pool.query = mockQuery;

            // Call the function with mock arguments
            const user = 123;
            const limit = 10;
            const offset = 0;
            const result = await dbFunctions.allTransactions(user, limit, offset);

            // Assert that the mock function was called with the correct query and arguments
            expect(mockQuery).toHaveBeenCalledWith("select transactions.*, currencies.code as fromCode, currencies2.code as toCode from transactions left join currencies on transactions.from_currency = currencies.country left join currencies as currencies2 on transactions.to_currency = currencies2.country where (from_account = ? and operation != 'receive') or (to_account = ? and operation = 'receive') order by date desc limit ? offset ? ", [user, user, limit, offset]);

            // Assert that the function returns the expected result
            expect(result).toEqual({
                id: 1,
                from_account: 123,
                to_account: 456,
                from_currency: 'USD',
                to_currency: 'EUR',
                amount: 100,
                operation: 'send'
            });



        });


        it('should throw an error if the query fails', async () => {
            // Mock the pool.query function to throw an error
            const mockQuery = jest.fn().mockRejectedValueOnce(new Error('Database error'));
            pool.query = mockQuery;

            // Call the function with mock arguments
            const user = 123;
            const limit = 10;
            const offset = 0;

            // Assert that the function throws an error with the correct message
            await expect(dbFunctions.allTransactions(user, limit, offset)).rejects.toThrow('Database error');
        });
    });

    describe('insertTransaction', () => {
        it('should insert a transaction into the database', async () => {
            // Mock the pool.query function
            const mockQuery = jest.fn().mockResolvedValueOnce({affectedRows: 1});
            pool.query = mockQuery;

            // Call the function with mock arguments
            const fromAccount = 123;
            const toAccount = 456;
            const fromCurrency = 'USD';
            const toCurrency = 'EUR';
            const amount = 100;
            const operation = 'send';
            const result = await dbFunctions.insertTransaction(fromAccount, toAccount, fromCurrency, toCurrency, amount, operation);

            // Assert that the mock function was called with the correct query and arguments
            expect(mockQuery).toHaveBeenCalledWith("INSERT INTO transactions (from_account, to_account, from_currency, to_currency, amount, operation) VALUES (?, ?, ?, ?, ?, ?)", [fromAccount, toAccount, fromCurrency, toCurrency, amount, operation]);

            // Assert that the function returns the expected result
            expect(result).toEqual({affectedRows: 1});
        });

        it('should throw an error if the query fails', async () => {
            // Mock the pool.query function to throw an error
            const mockQuery = jest.fn().mockRejectedValueOnce(new Error('Database error'));
            pool.query = mockQuery;

            // Call the function with mock arguments
            const fromAccount = 123;
            const toAccount = 456;
            const fromCurrency = 'USD';
            const toCurrency = 'EUR';
            const amount = 100;

            // Assert that the function throws an error with the correct message
            await expect(dbFunctions.insertTransaction(fromAccount, toAccount, fromCurrency, toCurrency, amount)).rejects.toThrow('Database error');
        });
    });
});



