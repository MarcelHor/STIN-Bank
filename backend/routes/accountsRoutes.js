const express = require('express');
const router = express.Router();
const {removeAccount, getAllAccounts, depositBalance, withdrawBalance, setDefaultAccount} = require('../controllers/accountsController');
const {verifyToken} = require('../middleware/verifyToken');


router.delete('/api/accounts/remove',verifyToken, removeAccount);

router.get('/api/accounts', verifyToken, getAllAccounts);

router.post('/api/accounts/withdraw', verifyToken, withdrawBalance);

router.post('/api/accounts/deposit', verifyToken, depositBalance);

router.post('/api/accounts/default', verifyToken, setDefaultAccount)

module.exports = router;