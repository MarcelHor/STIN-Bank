const bcrypt = require("bcrypt");
const {validateRegisterInput, validateLoginInput} = require("../middleware/validation");
const authFunctions = require("../utils/authFunctions");
const authRepository = require("../repositories/authRepository");

exports.login = async (req, res, next) => {
    try {
        const {error, valid} = validateLoginInput(req.body);
        if (!valid) {
            return res.status(400).json({message: "Invalid password"});
        }

        const {email, password} = req.body;

        const [users] = await authRepository.findUserByEmail(email);

        if (users.length > 0) {
            const user = users[0];
            const validPassword = await bcrypt.compare(password, user.passwordHash);
            if (validPassword) {
                const code = Math.floor(100000 + Math.random() * 900000);
                authFunctions.sendMail(email, code);
                const [existingCode] = await authRepository.findTwoFactorAuthCode(email);
                if (existingCode.length > 0) {
                    await authRepository.deleteTwoFactorAuthCode(email);
                }

                await authRepository.createTwoFactorAuthCode(email, code);
                return res.status(200).json({message: "Login successful", accountNumber: user.email});
            } else {
                return res.status(401).json({message: "Invalid password"});
            }
        } else {
            return res.status(401).json({message: "User does not exist"});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json("Internal server error");
    }
};

exports.register = async (req, res) => {
    try {
        const {error, valid} = validateRegisterInput(req.body);
        if (!valid) {
            return res.status(400).json(error);
        }
        const {firstName, lastName, password, email} = req.body;

        const [existingUser] = await authRepository.findUserByEmail(email);
        if (existingUser.length > 0) {
            console.log("User already exists");
            return res.status(409).json("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
        const bankID = authFunctions.generateBankID();
        await authRepository.createUser(firstName, lastName, hashedPassword, email, bankID);
        console.log("User created");
        return res.status(201).json("User created");
    } catch (err) {
        console.log(err);
        return res.status(500).json("Internal server error");
    }
};

exports.verifyTwoFactor = async (req, res) => {
    try {
        const {email, code} = req.body;
        const [existingCode] = await authRepository.findTwoFactorAuthCode(email);
        if (existingCode.length > 0) {
            if (existingCode[0].created_at >= new Date(new Date().getTime() + 5 * 60 * 1000)) {
                await authRepository.deleteTwoFactorAuthCode(email);
                return res.status(401).json({message: "Code expired"});
            } else if (existingCode[0].code == code) {
                await authRepository.deleteTwoFactorAuthCode(email);
                const [user] = await authRepository.findUserByEmail(email);
                const token = authFunctions.generateToken(user[0].accountNumber);
                return res.status(200).json({message: "Login successful", token});
            } else {
                return res.status(401).json({message: "Invalid code"});
            }
        } else {
            return res.status(401).json({message: "Invalid code"});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json("Internal server error");
    }
};
