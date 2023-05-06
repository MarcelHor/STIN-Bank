const currenciesRepository = require("../repositories/currenciesRepository");

exports.getAllCurrencies = async (req, res) => {
    try {
        const result = await currenciesRepository.getAllCurrencies();
        res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error", message: "Server error",
        });
    }
}
