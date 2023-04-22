const pool = require("../config/db");

exports.getAccount = async (user, currency) => {
    return await pool.query("SELECT * FROM accounts WHERE user = ? AND currency = ?", [user, currency]);
}

exports.getDefaultAccount = async (user) => {
    return await pool.query("SELECT * FROM accounts WHERE user = ? AND isDefault = 1", [user]);
}

exports.getCurrency = async (currency) => {
    return await pool.query("SELECT * FROM currencies WHERE country = ?", [currency]);
}

exports.getAllAccounts = async (user) => {
    return await pool.query("select accounts.*, currencies.code\n" + "  from accounts\n" + "  join currencies on accounts.currency = currencies.country WHERE user = ?", [user]);
}

exports.deleteAccount = async (user, currency) => {
    return await pool.query("DELETE FROM accounts WHERE user = ? AND currency = ?", [user, currency]);
}

exports.addBalance = async (user, currency, balance) => {
    return await pool.query("UPDATE accounts SET balance = balance + ? WHERE user = ? AND currency = ?", [balance, user, currency]);
}

exports.subtractBalance = async (user, currency, balance) => {
    return await pool.query("UPDATE accounts SET balance = balance - ? WHERE user = ? AND currency = ?", [balance, user, currency]);
}

exports.setDefaultAccount = async (user, currency) => {
    return await pool.query("UPDATE accounts SET isDefault = 0 WHERE user = ?", [user]).then(() => {
        return pool.query("UPDATE accounts SET isDefault = 1 WHERE user = ? AND currency = ?", [user, currency]);
    });
}

exports.insertAccount = async (user, currency, balance, isDefault) => {
    return await pool.query("INSERT INTO accounts (user, currency, balance, isDefault) VALUES (?, ?, ?, ?)", [user, currency, balance, isDefault]);
}