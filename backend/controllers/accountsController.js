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

exports.depositBalance = async (req, res) => {
    try {
        const user = req.user.accountNumber;
        const {currency, balance} = req.body;

        //if account does not exist, create it and if its first account of the user, set it as default
        const accountExists = await pool.query("SELECT * FROM accounts WHERE user = ? AND currency = ?", [user, currency]);
        if (accountExists[0].length === 0) {
            const AllAccounts = await pool.query("SELECT * FROM accounts WHERE user = ?", [user]);
            if (AllAccounts[0].length === 0) {
                await pool.query("INSERT INTO accounts (user, currency, balance, isDefault) VALUES (?, ?, ?, ?)", [user, currency, balance, 1]);
            } else {
                await pool.query("INSERT INTO accounts (user, currency, balance, isDefault) VALUES (?, ?, ?, ?)", [user, currency, balance, 0]);
            }
            return res.status(200).json({
                status: "success", message: "Account created successfully",
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

exports.withdrawBalance = async (req, res) => {
    try {
        const user = req.user.accountNumber;
        const {currency, balance} = req.body;

        const accountExists = await pool.query("SELECT * FROM accounts WHERE user = ? AND currency = ?", [user, currency]);
        if (accountExists[0].length === 0) {
            return res.status(400).json({
                status: "error", message: "Account does not exist",
            });
        }

        if (parseFloat(accountExists[0][0].balance) < balance) {
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

exports.setDefaultAccount = async (req, res) => {
    const user = req.user.accountNumber;
    const {currency} = req.body;

    try {
        const accountExists = await pool.query("SELECT * FROM accounts WHERE user = ? AND currency = ?", [user, currency]);
        if (accountExists[0].length === 0) {
            return res.status(400).json({
                status: "error", message: "Account does not exist",
            });
        }
        await pool.query("UPDATE accounts SET isDefault = 0 WHERE user = ?", [user]);
        await pool.query("UPDATE accounts SET isDefault = 1 WHERE user = ? AND currency = ?", [user, currency]);
        res.status(200).json({
            status: "success", message: "Default account set successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error", message: "Server error",
        });
    }
}

exports.sendBalance = async (req, res) => {
    const user = req.user.accountNumber;
    const {currency, balance, receiver} = req.body;

    try {
        const accountExists = await pool.query("SELECT * FROM accounts WHERE user = ? AND currency = ?", [user, currency]);
        if (accountExists[0].length === 0) {
            return res.status(400).json({
                status: "error", message: "Account does not exist",
            });
        }
        if (parseFloat(accountExists[0][0].balance) < balance) {
            return res.status(400).json({
                status: "error", message: "Insufficient funds",
            });
        }
        const receiverExists = await pool.query("SELECT * FROM accounts WHERE user = ? AND currency = ?", [receiver, currency]);
        if (receiverExists[0].length === 0) {
            return res.status(400).json({
                status: "error", message: "Receiver account does not exist",
            });
        }

        await pool.query("UPDATE accounts SET balance = balance - ? WHERE user = ? AND currency = ?", [balance, user, currency]);
        await pool.query("UPDATE accounts SET balance = balance + ? WHERE user = ? AND currency = ?", [balance, receiver, currency]);
        res.status(200).json({
            status: "success", message: "Balance sent successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error", message: "Server error",
        });
    }
}