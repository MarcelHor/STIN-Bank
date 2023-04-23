const express = require('express');
const router = express.Router();
const {getAllTransactions} = require('../controllers/transactionController');
const {verifyToken} = require("../middleware/verifyToken");


router.get('/api/transactions',verifyToken, getAllTransactions);

module.exports = router;
