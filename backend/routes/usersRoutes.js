const express = require('express');
const router = express.Router();
const { getUser } = require('../controllers/userController');
const { verifyToken } = require('../middleware/verifyToken');


router.get('/api/user', verifyToken, getUser);

module.exports = router;
