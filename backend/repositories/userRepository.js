const pool = require("../config/db");

exports.getUser = async (id) => {
    const result = await pool.query("SELECT * FROM users WHERE accountNumber = ?", [id]);
    return result[0];
}