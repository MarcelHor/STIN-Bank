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
        const {currency, balance, receiver} = req.body;
        console.log(user, currency, balance, receiver);

        //if receiver and currency are same, then add balance to the same account else add balance to the receiver account
        if (currency === receiver) {
            await pool.query("UPDATE accounts SET balance = balance + ? WHERE user = ? AND currency = ?", [balance, user, currency]);
            return res.status(200).json({
                status: "success", message: "Balance added successfully",
            });
        } else {
            const accountExists = await pool.query("SELECT * FROM accounts WHERE user = ? AND currency = ?", [user, currency]);
            if (accountExists[0].length === 0) {
                return res.status(400).json({
                    status: "error", message: "Account does not exist",
                });
            }
            const userRate = await pool.query("SELECT * FROM currencies WHERE country = ?", [currency]);
            const receiverRate = await pool.query("SELECT * FROM currencies WHERE country = ?", [receiver]);

            const convertedBalance = (balance * (userRate[0][0].exchangeRate / receiverRate[0][0].amount));
            const balanceInReceiver = (convertedBalance / (receiverRate[0][0].exchangeRate / userRate[0][0].amount));
            console.log(balanceInReceiver);

            await pool.query("UPDATE accounts SET balance = balance + ? WHERE user = ? AND currency = ?", [balanceInReceiver, user, receiver]);

            res.status(200).json({
                status: "success", message: "Balance added successfully",
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error", message: "Server error",
        });
    }
};


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
    console.log(user, currency, balance, receiver);

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
            const defaultAccount = await pool.query("SELECT * FROM accounts WHERE user = ? AND isDefault = 1", [receiver]);
            if (defaultAccount[0].length === 0) {
                return res.status(400).json({
                    status: "error", message: "Receiver does not have a default account",
                });
            }

            const receiverRate = await pool.query("SELECT * FROM currencies WHERE country = ?", [defaultAccount[0][0].currency]);
            const userRate = await pool.query("SELECT * FROM currencies WHERE country = ?", [currency]);

            const convertedBalance = (balance * (userRate[0][0].exchangeRate / userRate[0][0].amount))
            const balanceInReceiverCurrency = (convertedBalance / (receiverRate[0][0].exchangeRate / receiverRate[0][0].amount))
            console.log(balanceInReceiverCurrency);

            await pool.query("UPDATE accounts SET balance = balance - ? WHERE user = ? AND currency = ?", [balance, user, currency]);
            await pool.query("UPDATE accounts SET balance = balance + ? WHERE user = ? AND currency = ?", [balanceInReceiverCurrency, receiver, defaultAccount[0][0].currency]);

            return res.status(200).json({
                status: "success", message: "Balance sent successfully",
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