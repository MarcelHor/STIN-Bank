const pool = require("../config/db");
const utils = require("../utils/fetchCurrencies");

exports.fetchCurrencies = async (req, res) => {
    try {
        await utils.insertCurrencies().then(res.status(200).json({
            status: "success", message: "Currencies fetched successfully",
        }));
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
        res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error", message: "Server error",
        });
    }
}
