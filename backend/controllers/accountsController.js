const pool = require("../config/db");

exports.addAccount = async (req, res) => {
    try {
        const {user, currency, balance} = req.body;

        const accountExists = await pool.query("SELECT * FROM accounts WHERE user = ? AND currency = ?", [user, currency]);
        if (accountExists[0].length > 0) {
            return res.status(400).json({
                status: "error", message: "Account already exists",
            });
        }
        await pool.query("INSERT INTO accounts (user, currency, balance) VALUES (?, ?, ?)", [user, currency, balance]);
        res.status(200).json({
            status: "success", message: "Account added successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error", message: "Server error",
        });
    }
};

exports.removeAccount = async (req, res) => {
    try {
        const {user, currency} = req.body;

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
        const {user} = req.body;

        const accounts = await pool.query("SELECT * FROM accounts WHERE user = ?", [user]);
        res.status(200).json(accounts[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error", message: "Server error",
        });
    }
};

exports.getAccount = async (req, res) => {
    try {
        const {user, currency} = req.body;

        const accountExists = await pool.query("SELECT * FROM accounts WHERE user = ? AND currency = ?", [user, currency]);
        if (accountExists[0].length === 0) {
            return res.status(400).json({
                status: "error", message: "Account does not exist",
            });
        }

        const account = await pool.query("SELECT * FROM accounts WHERE user = ? AND currency = ?", [user, currency]);
        res.status(200).json(account[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error", message: "Server error",
        });
    }
};

exports.addBalanceToAccount = async (req, res) => {
    try {
        const {user, currency, balance} = req.body;

        const accountExists = await pool.query("SELECT * FROM accounts WHERE user = ? AND currency = ?", [user, currency]);
        if (accountExists[0].length === 0) {
            return res.status(400).json({
                status: "error", message: "Account does not exist",
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
