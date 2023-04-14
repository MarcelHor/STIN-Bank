const cron = require('node-cron');
const https = require('https');

function runCron() {

    //run cron every 20 seconds
    cron.schedule('*/20 * * * * *', () => {
        console.log('running a task every 20 seconds');
        fetchCurrencies().then(() => {
            console.log('fetchCurrencies() finished');
        });
    });

    cron.schedule('0 14 * * *', () => {
        console.log('running a task every day at 2:00 PM');
        fetchCurrencies().then(() => {
            console.log('fetchCurrencies() finished');
        });
    });
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
    getCurrencies,
}