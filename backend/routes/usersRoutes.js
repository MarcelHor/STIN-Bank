const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

router.get('/', async (req, res) => {
    res.send('Welcome to the api of STIN Bank');
});

router.get('/api/users', async (req, res) => {
    //get token from header
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    //check if token exists
    if (!token) {
        return res.status(401).send('Access denied');
    }
    //verify token
    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        //get user from database without password hash
        const user = await pool.query('SELECT id, firstName, lastName, email, accountNumber FROM users WHERE id = ?', [verified.id]);
        res.status(200).json(user[0]);
    } catch (err) {
        res.status(400).send('Invalid token');
    }
});

module.exports = router;
