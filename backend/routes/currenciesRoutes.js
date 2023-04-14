const express = require('express');
const router = express.Router();
const {fetchCurrencies, getAllCurrencies} = require('../controllers/currenciesController');

router.post('/api/currencies/fetch', fetchCurrencies);
router.get('/api/currencies/', getAllCurrencies);

module.exports = router;
