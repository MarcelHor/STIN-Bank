const jwt = require('jsonwebtoken');
exports.verifyToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send('Access denied');
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
        req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};