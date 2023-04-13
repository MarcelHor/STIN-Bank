const express = require('express');
const app = express();
const cors = require('cors');
const authRouter = require('./routes/authRoutes');

//middleware
app.use(cors({
    origin: 'http://127.0.0.1:5173', credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//routes
app.use('/', authRouter);

//listening
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});



