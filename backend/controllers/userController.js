const userRepository = require('../repositories/userRepository');

exports.getUser = async (req, res) => {
    const userID = req.user.accountNumber;
    res.status(200).json(await userRepository.getUser(userID));
}
