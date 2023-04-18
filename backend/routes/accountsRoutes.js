const express = require('express');
const router = express.Router();
const {removeAccount, getAllAccounts, addBalanceToAccount, withdrawBalanceFromAccount,} = require('../controllers/accountsController');
const {verifyToken} = require('../middleware/verifyToken');


router.delete('/api/accounts/remove',verifyToken, removeAccount);

router.get('/api/accounts', verifyToken, getAllAccounts);

router.post('/api/accounts/withdraw', verifyToken, withdrawBalanceFromAccount);

router.post('/api/accounts/deposit', verifyToken, addBalanceToAccount);

module.exports = router;