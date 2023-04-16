const pool = require("../config/db");
const bcrypt = require("bcrypt");
const {validateRegisterInput, validateLoginInput} = require("../middleware/validation");
const {generateToken, generateBankID, sendMail} = require("../utils/authFunctions");

exports.login = async (req, res, next) => {
    try {
        const {error, valid} = validateLoginInput(req.body);
        if (!valid) {
            return res.status(400).json({error, message: "Invalid password"});
        }

        const {email, password} = req.body;

        const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email,]);

        if (users.length > 0) {
            const user = users[0];
            const validPassword = await bcrypt.compare(password, user.passwordHash);
            if (validPassword) {
                const code = Math.floor(100000 + Math.random() * 900000);
                sendMail(email, code);
                const [existingCode] = await pool.query("SELECT * FROM two_factor_auth WHERE email = ?", [email]);
                if (existingCode.length > 0) {
                    await pool.query("DELETE FROM two_factor_auth WHERE email = ?", [email]);
                }

                await pool.query("INSERT INTO two_factor_auth (email, code) VALUES (?, ?)", [email, code]);
                return res.status(200).json({message: "Login successful", accountNumber: user.email});
            } else {
                return res.status(401).json({message: "Invalid password"});
            }
        } else {
            return res.status(401).json({message: "User does not exist"});
        }
    } catch (err) {
        next(err);
    }
};

exports.register = async (req, res) => {
    try {
        const {error, valid} = validateRegisterInput(req.body);
        if (!valid) {
            return res.status(400).json(error);
        }
        const {firstName, lastName, password, email} = req.body;

        const [existingUser] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

        if (existingUser.length > 0) {
            return res.status(409).send("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
        const bankID = generateBankID();
        await pool.query("INSERT INTO users (firstName, lastName, passwordHash, email, accountNumber) VALUES (?, ?, ?, ?, ?)", [firstName, lastName, hashedPassword, email, bankID]);

        return res.status(201).send("User created");
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
};

exports.verifyTwoFactor = async (req, res) => {
    try {
        const {email, code} = req.body;
        const [existingCode] = await pool.query("SELECT * FROM two_factor_auth WHERE email = ?", [email]);
        if (existingCode.length > 0) {
            if (existingCode[0].created_at < new Date(new Date().getTime() - 5 * 60 * 1000)) {
                await pool.query("DELETE FROM two_factor_auth WHERE email = ?", [email]);
                return res.status(401).json({message: "Code expired"});
            } else if (existingCode[0].code == code) {
                await pool.query("DELETE FROM two_factor_auth WHERE email = ?", [email]);
                const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
                const token = generateToken(user[0].accountNumber);
                return res.status(200).json({message: "Login successful", token});
            } else {
                return res.status(401).json({message: "Invalid code"});
            }
        } else {
            return res.status(401).json({message: "Invalid code"});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
};
