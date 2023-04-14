const cron = require('node-cron');
const https = require('https');
const pool = require("../config/db");

const runCron = () => {
    cron.schedule('0 14 * * *', () => {
        console.log('running a task every day at 2:00 PM');
        insertCurrencies().then(
            () => console.log('Currencies fetched successfully'),
        )
    });
}

const insertCurrencies = async (currencies) => {
    currencies = await getCurrencies();
    for (let i = 0; i < currencies.length; i++) {
        const currency = currencies[i];
        await pool.query("INSERT INTO currencies (name, amount, code, exchangeRate, country) \n" +
            "VALUES (?, ?, ?, ?, ?) \n" +
            "ON DUPLICATE KEY UPDATE \n" +
            "    name = VALUES(name), \n" +
            "    amount = VALUES(amount), \n" +
            "    code = VALUES(code), \n" +
            "    exchangeRate = VALUES(exchangeRate);",
            [currency.currency, currency.amount, currency.code, currency.rate, currency.country]);
    }
}


const getCurrencies = async () => {
    const data = await fetchCurrencies();
    const lines = data.split('\n');
    const currencies = [];
    for (let i = 2; i < lines.length - 1; i++) {
        const line = lines[i].split('|');
        const currency = {
            country: line[0],
            currency: line[1],
            amount: line[2],
            code: line[3],
            rate: line[4].replace(',', '.'),
        };
        currencies.push(currency);
    }
    return currencies;
}


const fetchCurrencies = async () => {
    const url = 'https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt';
    try {
        const response = await new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
            }).on('error', (error) => {
                reject(error);
            });
        });
        return response;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = {
    runCron,
    insertCurrencies,
}