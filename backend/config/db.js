require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_IP,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}).promise();
console.log('Connected to database');
console.log('process.env.DB_IP: ', process.env.DB_IP);
module.exports = pool;



