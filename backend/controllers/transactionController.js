const pool = require("../config/db");

exports.getAllTransactions = async (req, res) => {
    try {
        const user = req.user.accountNumber;
        if (!user) {
            return res.status(400).json({message: "User id is required"});
        }

        // get the limit and offset parameters from the query string
        const limit = req.query.limit ? parseInt(req.query.limit) : 10; // default limit of 10
        const offset = req.query.offset ? parseInt(req.query.offset) : 0; // default offset of 0

        const allTransactions = await pool.query("select transactions.*, currencies.code as from_currency_code, currencies2.code as to_currency_code\n" +
            "from transactions\n" +
            "        left join currencies on transactions.from_currency = currencies.country\n" +
            "        left join currencies currencies2 on transactions.to_currency = currencies2.country " +
            "WHERE transactions.from_account = ? ORDER BY date DESC LIMIT ? OFFSET ? ", [user, limit, offset]);

        res.json(allTransactions[0]);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

