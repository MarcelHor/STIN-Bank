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

        const allTransactions = await pool.query("select transactions.*, currencies.code as fromCode, currencies2.code as toCode from transactions left join currencies on transactions.from_currency = currencies.country left join currencies as currencies2 on transactions.to_currency = currencies2.country where (from_account = ? and operation != 'receive') or (to_account = ? and operation = 'receive') order by date desc limit ? offset ? ", [user, user , limit, offset]);

        res.json(allTransactions[0]);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

