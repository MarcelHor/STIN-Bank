const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db');

const generateBankID = () => {
    const BankID = Math.floor(Math.random() * 1000000000);
    return BankID;
}

router.post('/api/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        //check if user exists
        const user = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user[0].length > 0) {
            //get password hash from user
            const passwordHash = user[0][0].passwordHash;
            //compare password with password hash
            const validPassword = await bcrypt.compare(password, passwordHash);
            if (validPassword) {
                //create token
                const token = jwt.sign({id: user[0][0].id}, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: 1800 //expires in 30 minutes
                });
                //refresh token
                const refreshToken = jwt.sign({id: user[0][0].id}, process.env.ACCESS_TOKEN_REFRESH, {
                    expiresIn: 86400 //expires in 24 hours
                });
                //save refresh token in database
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 1);
                await pool.query('INSERT INTO refreshtokens(user_id, token, expires_at) VALUES (?, ?,?)', [user[0][0].id, refreshToken, expiresAt]);
                res.status(200).json({token: token, refreshToken: refreshToken});
            } else {
                res.status(401).send('Invalid password');
            }
        } else {
            res.status(401).send('User does not exist');
        }
    } catch (err) {
        console.log(err);
    }
});

router.post('/api/register', async (req, res) => {
    const {firstName, lastName, password, email} = req.body;
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
    try {
        //check if user exists by first name and last name and email
        const user = await pool.query('SELECT * FROM users WHERE firstName = ? AND lastName = ? AND email = ?', [firstName, lastName, email]);
        if (user[0].length > 0) {
            res.status(401).send('User already exists');
        } else {
            //create new user
            const BankID = generateBankID();
            const newUser = await pool.query('INSERT INTO users (firstName, lastName, passwordHash, email, accountNumber) VALUES (?, ?, ?, ?,?)', [firstName, lastName, hashedPassword, email, BankID]);
            res.status(200).send('User created');
        }
    } catch (err) {
        console.log(err);
    }
});

// this route is used to refresh the token when it expires and the user is still logged in (refresh token is still valid)
router.post('/api/refreshToken', async (req, res) => {

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).send('Access denied');
    }
    try {
        const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await pool.query('SELECT * FROM users WHERE id = ?', [verified.id]);
        if (user[0].length > 0) {
            const token = jwt.sign({id: user[0][0].id}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: 86400 //expires in 24 hours
            });
            res.status(200).json({token: token});
        } else {
            res.status(401).send('User does not exist');
        }
    } catch (err) {
        res.status(400).send('Invalid token');
    }
});

// this route is used to verify the token when the user is logged in and the token is still valid
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access denied');
    }
    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
}

// this route is used to get the user profile when the user is logged in and the token is still valid
router.get('/api/user-profile', verifyToken, async (req, res) => {
    const user = await pool.query('SELECT id, firstName, lastName, email, accountNumber FROM users WHERE id = ?', [req.user.id]);
    res.status(200).json(user[0]);
});

router.post('/api/logout', async (req, res) => {
    const userId = req.userId;
    await pool.query('DELETE FROM refreshtokens WHERE user_id = ?', [userId]);
    res.status(200).send('User logged out');
});


module.exports = router;
