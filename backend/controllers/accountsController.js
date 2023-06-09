const accountsRepository = require("../repositories/accountsRepository");
const transactionsRepository = require("../repositories/transactionRepository");
exports.removeAccount = async (req, res) => {
    try {
        const user = req.user.accountNumber;
        const {currency} = req.body;

        const accountExists = await accountsRepository.getAccount(user, currency);
        if (accountExists[0].length === 0) {
            return res.status(400).json({
                status: "error", message: "Account does not exist",
            });
        }

        const defaultAccount = await accountsRepository.getDefaultAccount(user);
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

        const userRate = await accountsRepository.getCurrency(currency);
        const defaultRate = await accountsRepository.getCurrency(defaultAccount[0][0].currency);

        const convertedBalance = (accountExists[0][0].balance * (userRate[0][0].exchangeRate / userRate[0][0].amount));
        const balanceInDefault = (convertedBalance / (defaultRate[0][0].exchangeRate / defaultRate[0][0].amount));
        await accountsRepository.addBalance(user, defaultAccount[0][0].currency, balanceInDefault);
        await accountsRepository.deleteAccount(user, currency);
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
        const accounts = await accountsRepository.getAllAccounts(user);
        if (!user || !req.user.accountNumber) {
            return res.status(400).json({message: 'User id is required'});
        }
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
            await accountsRepository.addBalance(user, currency, balance);
            await transactionsRepository.insertTransaction(user, user, currency, receiver, balance, "deposit");
            return res.status(200).json({
                status: "success", message: "Balance added successfully",
            });
        } else {
            const userRate = await accountsRepository.getCurrency(currency);
            const receiverRate = await accountsRepository.getCurrency(receiver);

            const convertedBalance = (balance * (userRate[0][0].exchangeRate / userRate[0][0].amount));
            const balanceInReceiver = (convertedBalance / (receiverRate[0][0].exchangeRate / receiverRate[0][0].amount));
            await accountsRepository.addBalance(user, receiver, balanceInReceiver);
            await transactionsRepository.insertTransaction(user, user, currency, receiver, balance, "deposit");
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

        const accountExists = await accountsRepository.getAccount(user, currency);
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

        await accountsRepository.subtractBalance(user, currency, balance);
        await transactionsRepository.insertTransaction(user, null, currency, null, balance, "withdraw");
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
        const accountExists = await accountsRepository.getAccount(user, currency);
        if (accountExists[0].length === 0) {
            return res.status(400).json({
                status: "error", message: "Account does not exist",
            });
        }
        await accountsRepository.setDefaultAccount(user, currency);
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
        let balanceToDeduct;
        const accountExists = await accountsRepository.getAccount(user, currency);
        if (accountExists[0].length === 0) {
            const defaultAccount = await accountsRepository.getDefaultAccount(user);
            const defaultRate = await accountsRepository.getCurrency(defaultAccount[0][0].currency);
            const userRate = await accountsRepository.getCurrency(currency);

            const convertedBalance = (balance * (userRate[0][0].exchangeRate / userRate[0][0].amount));
            balanceToDeduct = (convertedBalance / (defaultRate[0][0].exchangeRate / defaultRate[0][0].amount));

            const totalAllowed = parseFloat(defaultAccount[0][0].balance) + parseFloat(defaultAccount[0][0].balance) * 0.1;
            if (balanceToDeduct > totalAllowed) {
                return res.status(400).json({
                    status: "error", message: "Insufficient funds, even with allowed overdraft",
                });
            }

            if (parseFloat(defaultAccount[0][0].balance) < balanceToDeduct) {
                // 10% interest on the negative amount
                const interest = (balanceToDeduct - parseFloat(defaultAccount[0][0].balance)) * 0.1;
                balanceToDeduct += interest;
            }

            await accountsRepository.subtractBalance(user, defaultAccount[0][0].currency, balanceToDeduct);
        } else {
            balanceToDeduct = balance;
            const totalAllowed = parseFloat(accountExists[0][0].balance) + parseFloat(accountExists[0][0].balance) * 0.1;
            if (balanceToDeduct > totalAllowed) {
                return res.status(400).json({
                    status: "error", message: "Insufficient funds, even with allowed overdraft",
                });
            }

            if (parseFloat(accountExists[0][0].balance) < balanceToDeduct) {
                // 10% interest on the negative amount
                const interest = (balanceToDeduct - parseFloat(accountExists[0][0].balance)) * 0.1;
                balanceToDeduct += interest;
            }

            await accountsRepository.subtractBalance(user, currency, balanceToDeduct);
        }

        const receiverExists = await accountsRepository.getAccount(receiver, currency);
        if (receiverExists[0].length === 0) {
            const receiverDefaultAccount = await accountsRepository.getDefaultAccount(receiver);
            const receiverDefaultRate = await accountsRepository.getCurrency(receiverDefaultAccount[0][0].currency);
            const receiverRate = await accountsRepository.getCurrency(currency);
            const receiverConvertedBalance = (balance * (receiverRate[0][0].exchangeRate / receiverRate[0][0].amount)) / (receiverDefaultRate[0][0].exchangeRate / receiverDefaultRate[0][0].amount);

            if (receiverDefaultAccount[0].length === 0) {
                return res.status(400).json({
                    status: "error", message: "Receiver does not have a default account",
                });
            }

            await accountsRepository.addBalance(receiver, receiverDefaultAccount[0][0].currency, receiverConvertedBalance);
            await transactionsRepository.insertTransaction(user, receiver, currency,  receiverDefaultAccount[0][0].currency, balance, "send");
            await transactionsRepository.insertTransaction(user, receiver, currency,  receiverDefaultAccount[0][0].currency, balance, "receive");

        } else {
            await accountsRepository.addBalance(receiver, currency, balance);
            await transactionsRepository.insertTransaction(user, receiver, currency, currency, balance, "send");
            await transactionsRepository.insertTransaction(user, receiver, currency, currency, balance, "receive");
        }

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
        const accountExists = await accountsRepository.getAccount(user, currency);
        if (accountExists[0].length !== 0) {
            return res.status(400).json({
                status: "error", message: "Account already exists",
            });
        }

        const defaultAccount = await accountsRepository.getDefaultAccount(user);
        if (defaultAccount[0].length === 0) {
            await accountsRepository.insertAccount(user, currency, 0, 1);
            return res.status(200).json({
                status: "success", message: "Account added successfully",
            });
        } else {
            await accountsRepository.insertAccount(user, currency, 0, 0);
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