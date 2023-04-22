const pool = require("../config/db");

exports.allTransactions = async (user, limit, offset) => {
    try {
        const allTransactions = await pool.query("select transactions.*, currencies.code as fromCode, currencies2.code as toCode from transactions left join currencies on transactions.from_currency = currencies.country left join currencies as currencies2 on transactions.to_currency = currencies2.country where (from_account = ? and operation != 'receive') or (to_account = ? and operation = 'receive') order by date desc limit ? offset ? ", [user, user, limit, offset]);
        return allTransactions[0];
    } catch (err) {
        throw err;
    }
}

exports.insertTransaction = async (fromAccount, toAccount, fromCurrency, toCurrency, amount, operation) => {
    return await pool.query("INSERT INTO transactions (from_account, to_account, from_currency, to_currency, amount, operation) VALUES (?, ?, ?, ?, ?, ?)", [fromAccount, toAccount, fromCurrency, toCurrency, amount, operation]);
}


