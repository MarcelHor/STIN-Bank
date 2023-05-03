const express = require('express');
const router = express.Router();
const {getAllCurrencies} = require('../controllers/currenciesController');

router.get('/api/currencies/', getAllCurrencies);

module.exports = router;
