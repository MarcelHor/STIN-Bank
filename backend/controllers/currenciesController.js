const pool = require("../config/db");
const utils = require("../utils/fetchCurrencies");

exports.fetchCurrencies = async (req, res) => {
    try {
        const currencies = await utils.getCurrencies();
        for (let i = 0; i < currencies.length; i++) {
            const currency = currencies[i];
            await pool.query("INSERT INTO currencies (name, amount, code, exchangeRate, country) \n" +
                "VALUES (?, ?, ?, ?, ?) \n" +
                "ON DUPLICATE KEY UPDATE \n" +
                "    name = VALUES(name), \n" +
                "    amount = VALUES(amount), \n" +
                "    code = VALUES(code), \n" +
                "    exchangeRate = VALUES(exchangeRate);", [currency.currency, currency.amount, currency.code, currency.rate, currency.country]);
        }
        res.status(200).json({
            status: "success", message: "Currencies fetched successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error", message: "Server error",
        });
    }
};

exports.getAllCurrencies = async (req, res) => {
    try {
        const query = "SELECT * FROM currencies";
        const result = await pool.query(query);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error", message: "Server error",
        });
    }
}
