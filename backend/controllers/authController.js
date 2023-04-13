const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { validateRegisterInput, validateLoginInput } = require("../middleware/validation");
const { generateToken, generateBankID } = require("../utils/authFunctions");

exports.login = async (req, res, next) => {
    try {
        // Validate user input
        const { error, valid } = validateLoginInput(req.body);
        if (!valid) {
            return res.status(400).json(error); // return early
        }

        const { email, password } = req.body;

        const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
            email,
        ]);

        if (users.length > 0) {
            const user = users[0];
            const validPassword = await bcrypt.compare(
                password,
                user.passwordHash
            );
            if (validPassword) {
                const token = generateToken(user.id);
                return res.status(200).json({ token }); // return early
            } else {
                return res.status(401).json({ message: "Invalid password" }); // return early
            }
        } else {
            return res.status(401).json({ message: "User does not exist" }); // return early
        }
    } catch (err) {
        next(err);
    }
};

exports.register = async (req, res) => {
    try {
        // Validate user input
        const { error, valid } = validateRegisterInput(req.body);
        if (!valid) {
            return res.status(400).json(error); // return early
        }
        const { firstName, lastName, password, email } = req.body;

        const [existingUser] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

        if (existingUser.length > 0) {
            return res.status(409).send("User already exists"); // return early
        }

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
        const bankID = generateBankID();
        const result = await pool.query("INSERT INTO users (firstName, lastName, passwordHash, email, accountNumber) VALUES (?, ?, ?, ?, ?)", [firstName, lastName, hashedPassword, email, bankID]);

        if (result.affectedRows !== 1) {
            return res.status(500).send("Internal server error"); // return early
        }

        return res.status(201).send("User created"); // send response only once
    } catch (err) {
        console.log(err);
       return  res.status(500).send("Internal server error"); // send response only once
    }
};
