const pool = require("../config/db");

exports.getUser = async (req, res) => {
    const userID = req.user.id;
    console.log(userID);
    const user = await pool.query('SELECT id, firstName, lastName, email, accountNumber FROM users WHERE id = ?', [userID]);
    res.status(200).json(user[0]);
}
