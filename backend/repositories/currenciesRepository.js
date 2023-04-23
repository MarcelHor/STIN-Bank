const pool = require("../config/db");

exports.getAllCurrencies = async () => {
    return await pool.query("SELECT * FROM currencies");
}

exports.insertCurrency = async (currency) => {
    await pool.query("INSERT INTO currencies (name, amount, code, exchangeRate, country) \n" + "VALUES (?, ?, ?, ?, ?) \n" + "ON DUPLICATE KEY UPDATE \n" + "    name = VALUES(name), \n" + "    amount = VALUES(amount), \n" + "    code = VALUES(code), \n" + "    exchangeRate = VALUES(exchangeRate);", [currency.currency, currency.amount, currency.code, currency.rate, currency.country]);
}