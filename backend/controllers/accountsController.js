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

        const defaultAccount = await pool.query("SELECT * FROM accounts WHERE user = ? AND isDefault = 1", [user]);
        if (defaultAccount[0][0].currency === currency) {
            return res.status(400).json({
                status: "error", message: "Cannot delete default account",
            });
        }

        if (defaultAccount[0].length === 0) {
            return res.status(400).json({
                status: "error", message: "Default account not set",
            });
        }

        const userRate = await pool.query("SELECT * FROM currencies WHERE country = ?", [currency]);
        const defaultRate = await pool.query("SELECT * FROM currencies WHERE country = ?", [defaultAccount[0][0].currency]);

        const convertedBalance = (accountExists[0][0].balance * (userRate[0][0].exchangeRate / userRate[0][0].amount));
        const balanceInDefault = (convertedBalance / (defaultRate[0][0].exchangeRate / defaultRate[0][0].amount));
        await pool.query("UPDATE accounts SET balance = balance + ? WHERE user = ? AND currency = ?", [balanceInDefault, user, defaultAccount[0][0].currency]);

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

        //if receiver and currency are same, then add balance to the same account else add balance to the receiver account
        if (currency === receiver) {
            await pool.query("UPDATE accounts SET balance = balance + ? WHERE user = ? AND currency = ?", [balance, user, currency]);
            return res.status(200).json({
                status: "success", message: "Balance added successfully",
            });
        } else {

            const userRate = await pool.query("SELECT * FROM currencies WHERE country = ?", [currency]);
            const receiverRate = await pool.query("SELECT * FROM currencies WHERE country = ?", [receiver]);

            const convertedBalance = (balance * (userRate[0][0].exchangeRate / userRate[0][0].amount));
            const balanceInReceiver = (convertedBalance / (receiverRate[0][0].exchangeRate / receiverRate[0][0].amount));
            await pool.query("UPDATE accounts SET balance = balance + ? WHERE user = ? AND currency = ?", [balanceInReceiver, user, receiver]);
            await pool.query("INSERT INTO transactions (from_account, from_currency, to_account, to_currency, amount, operation) VALUES (?, ?, ?, ?, ?, ?)", [user, currency, user, receiver, balance, "deposit"]);
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
        await pool.query("INSERT INTO transactions (from_account, from_currency, amount, operation) VALUES (?, ?, ?, ?)", [user, currency, balance, "withdraw"]);
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
        if (parseFloat(user) === parseFloat(receiver)) {
            return res.status(400).json({
                status: "error", message: "You cannot send money to yourself",
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

            await pool.query("UPDATE accounts SET balance = balance - ? WHERE user = ? AND currency = ?", [balance, user, currency]);
            await pool.query("UPDATE accounts SET balance = balance + ? WHERE user = ? AND currency = ?", [balanceInReceiverCurrency, receiver, defaultAccount[0][0].currency]);
            await pool.query("INSERT INTO transactions (from_account, from_currency, to_account, to_currency, amount, operation) VALUES (?, ?, ?, ?, ?, ?)", [user, currency, receiver, defaultAccount[0][0].currency, balance, "send"]);
            return res.status(200).json({
                status: "success", message: "Balance sent successfully",
            });
        }

        await pool.query("UPDATE accounts SET balance = balance - ? WHERE user = ? AND currency = ?", [balance, user, currency]);
        await pool.query("UPDATE accounts SET balance = balance + ? WHERE user = ? AND currency = ?", [balance, receiver, currency]);
        await pool.query("INSERT INTO transactions (from_account, from_currency, to_account, to_currency, amount, operation) VALUES (?, ?, ?, ?, ?, ?)", [user, currency, receiver, currency, balance, "send"]);


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

exports.addNewAccount = async (req, res) => {
    const user = req.user.accountNumber;
    const {currency} = req.body;
    try {
        const accountExists = await pool.query("SELECT * FROM accounts WHERE user = ? AND currency = ?", [user, currency]);
        if (accountExists[0].length !== 0) {
            return res.status(400).json({
                status: "error", message: "Account already exists",
            });
        }

        const defaultAccount = await pool.query("SELECT * FROM accounts WHERE user = ? AND isDefault = 1", [user]);
        if (defaultAccount[0].length === 0) {
            await pool.query("INSERT INTO accounts (user, currency,balance,isDefault) VALUES (?, ?, ?, ?)", [user, currency, 0, 1]);
            return res.status(200).json({
                status: "success", message: "Account added successfully",
            });
        } else {
            await pool.query("INSERT INTO accounts (user, currency,balance) VALUES (?, ?, ?)", [user, currency, 0]);
        }

        res.status(200).json({
            status: "success", message: "Account added successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error", message: "Server error",
        });
    }
}