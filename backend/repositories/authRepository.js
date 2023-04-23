const pool = require("../config/db");

exports.findUserByEmail = async (email) => {
   return await pool.query("SELECT * FROM users WHERE email = ?", [email]);
};

exports.createUser = async (firstName, lastName, passwordHash, email, accountNumber) => {
    await pool.query("INSERT INTO users (firstName, lastName, passwordHash, email, accountNumber) VALUES (?, ?, ?, ?, ?)", [firstName, lastName, passwordHash, email, accountNumber]);
};

exports.createTwoFactorAuthCode = async (email, code) => {
    await pool.query("INSERT INTO two_factor_auth (email, code) VALUES (?, ?)", [email, code]);
};

exports.findTwoFactorAuthCode = async (email) => {
    return await pool.query("SELECT * FROM two_factor_auth WHERE email = ?", [email]);

};

exports.deleteTwoFactorAuthCode = async (email) => {
    await pool.query("DELETE FROM two_factor_auth WHERE email = ?", [email]);
};
