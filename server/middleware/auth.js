const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({ success: false, message: 'Token not provided' });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);
        console.log("USERID <<<<<<<<", user.userId); 

        const foundUser = await User.findByPk(user.userId);

        if (!foundUser) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        req.user = foundUser;
        next();
    } catch (err) {
        console.error(err);
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ success: false, message: 'Token expired' });
        } else if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        } else {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
};

module.exports = {
    authenticate
};
