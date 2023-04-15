const express = require('express');
const router = express.Router();
const {
    addAccount, removeAccount, getAllAccounts, addBalanceToAccount, removeBalanceFromAccount, getAccount
} = require('../controllers/accountsController');

router.post('/api/accounts/add', addAccount);

router.delete('/api/accounts/remove', removeAccount);

router.get('/api/accounts/getAll', getAllAccounts);

router.get('/api/accounts/get', getAccount);

router.post('/api/accounts/addBalance', addBalanceToAccount);

module.exports = router;