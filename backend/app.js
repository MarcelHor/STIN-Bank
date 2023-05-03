const express = require('express');
const app = express();
const cors = require('cors');
const runCron = require('./utils/fetchCurrencies');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/usersRoutes');
const currenciesRouter = require('./routes/currenciesRoutes');
const accountRouter = require('./routes/accountsRoutes');
const transactionRouter = require('./routes/transactionRoutes');
require('dotenv').config();


//middleware
app.use(cors({
    origin: 'http://127.0.0.1:5173', credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//routes
app.use('/', authRouter);
app.use('/', userRouter);
app.use('/', currenciesRouter);
app.use('/', accountRouter);
app.use('/', transactionRouter);

//cron
runCron.runCron();

//listening
if(process.env.NODE_ENV !== 'test') {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}

module.exports = app;