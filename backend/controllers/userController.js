const pool = require("../config/db");

exports.getUser = async (req, res) => {
    const userID = req.user.accountNumber;
    const user = await pool.query('SELECT accountNumber, firstName, lastName, email FROM users WHERE accountNumber = ?', [userID]);
    res.status(200).json(user[0]);
}
