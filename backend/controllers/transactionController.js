const transactionController = require("../repositories/transactionRepository");

exports.getAllTransactions = async (req, res) => {
    try {
        const user = req.user.accountNumber;
        if (!user) {
            return res.status(400).json({message: "User id is required"});
        }

        // get the limit and offset parameters from the query string
        const limit = req.query.limit ? parseInt(req.query.limit) : 10; // default limit of 10
        const offset = req.query.offset ? parseInt(req.query.offset) : 0; // default offset of 0

        const allTransactions = await transactionController.allTransactions(user, limit, offset);
        res.status(200).json(allTransactions);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

