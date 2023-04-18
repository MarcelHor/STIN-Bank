const pool = require("../config/db");

exports.removeAccount = async (req, res) => {
    try {
        const user = req.user.accountNumber;
        const {currency} = req.body;

        const accountExists = await pool.query("SELECT * FROM accounts WHERE user = ? AND currency = ?", [user, currency]);
        if (accountExists[0].length === 0) {
            return res.status(400).json({
                status: "error", message: "Account does not exist",
            });
        }
        await pool.query("DELETE FROM accounts WHERE user = ? AND currency = ?", [user, currency]);
        res.status(200).json({
            status: "success", message: "Account removed successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error", message: "Server error",
        });
    }
};

exports.getAllAccounts = async (req, res) => {
    try {
        const user = req.user.accountNumber;
        const accounts = await pool.query("select accounts.*, currencies.code\n" + "  from accounts\n" + "  join currencies on accounts.currency = currencies.country WHERE user = ?", [user]);
        res.status(200).json(accounts[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error", message: "Server error",
        });
    }
};

exports.addBalanceToAccount = async (req, res) => {
    try {
        const user = req.user.accountNumber;
        const {currency, balance} = req.body;
        Math.abs(parseInt(balance));

        const accountExists = await pool.query("SELECT * FROM accounts WHERE user = ? AND currency = ?", [user, currency]);
        if (accountExists[0].length === 0) {
            await pool.query("INSERT INTO accounts (user, currency, balance) VALUES (?, ?, ?)", [user, currency, balance]);
            return res.status(200).json({
                status: "success", message: "Account added successfully",
            });
        }

        await pool.query("UPDATE accounts SET balance = balance + ? WHERE user = ? AND currency = ?", [balance, user, currency]);
        res.status(200).json({
            status: "success", message: "Balance added successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error", message: "Server error",
        });
    }
}

exports.withdrawBalanceFromAccount = async (req, res) => {
    try {
        const user = req.user.accountNumber;
        const {currency, balance} = req.body;
        Math.abs(parseInt(balance));

        const accountExists = await pool.query("SELECT * FROM accounts WHERE user = ? AND currency = ?", [user, currency]);
        if (accountExists[0].length === 0) {
            return res.status(400).json({
                status: "error", message: "Account does not exist",
            });
        }

        if (parseInt(accountExists[0][0].balance) <= balance) {
            return res.status(400).json({
                status: "error", message: "Insufficient funds",
            });
        }

        await pool.query("UPDATE accounts SET balance = balance - ? WHERE user = ? AND currency = ?", [balance, user, currency]);
        res.status(200).json({
            status: "success", message: "Balance withdrawn successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error", message: "Server error",
        });
    }
}