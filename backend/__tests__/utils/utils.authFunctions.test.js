const { generateToken, generateBankID, sendMail } = require('../../utils/authFunctions');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

process.env.ACCESS_TOKEN_SECRET = 'secret';
process.env.EMAIL = 'test@gmail.com';
process.env.EMAIL_PASSWORD = 'password';

// Mock nodemailer createTransport and sendMail functions
jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockImplementation((options, callback) => {
            callback(null, { info: 'Email sent successfully' });
        }),
    }),
}));

describe('utils', () => {
    describe('generateToken', () => {
        it('should generate a token with the user ID', () => {
            const token = generateToken(123);
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            expect(decodedToken.accountNumber).toBe(123);
        });

        it('should generate a token that expires in 1 hour', () => {
            const token = generateToken(123);
            const decodedToken = jwt.decode(token);
            const now = Math.floor(Date.now() / 1000);
            expect(decodedToken.exp - now).toBe(3600);
        });
    });

    describe('generateBankID', () => {
        it('should generate a random 9-digit number', () => {
            const bankID = generateBankID();
            expect(bankID.toString().length).toBe(9);
        });
    });

    describe('sendMail', () => {
        it('should send an email with the login code', () => {
            const email = 'test@example.com';
            const code = '1234';
            sendMail(email, code);
            expect(nodemailer.createTransport).toHaveBeenCalledTimes(1);
            expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(1);
            expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith(
                expect.objectContaining({
                    from: process.env.EMAIL,
                    to: email,
                    subject: 'Your login code to STIN BANK',
                    text: `Your login code is: ${code}`,
                }),
                expect.any(Function)
            );
        });
    });
});
