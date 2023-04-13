const jwt = require('jsonwebtoken');
const generateToken = (userId) => {
    const token = jwt.sign({id: userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 1800 //expires in 30 minutes
    });
    return token;
}

const generateBankID = () => {
    const BankID = Math.floor(Math.random() * 1000000000);
    return BankID;
}

module.exports = {
    generateToken, generateBankID,
};
