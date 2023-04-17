const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();


const generateToken = (userId) => {
    const token = jwt.sign({accountNumber: userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h'
    });
    return token;
}

const generateBankID = () => {
    const BankID = Math.floor(Math.random() * 1000000000);
    return BankID;
}

const Transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});


const mailOption = (email, code) => {
    return {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your login code to STIN BANK',
        text: `Your login code is: ${code}`
    }
}

const sendMail = (email, code) => {
    Transport.sendMail(mailOption(email, code), (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log("email sent successfully");
        }
    });
}


module.exports = {
    generateToken, generateBankID, sendMail
};

