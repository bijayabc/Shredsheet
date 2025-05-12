const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
    try {
        // Check if Authorization header exists
        if (!req.headers.authorization) {
            return res.status(401).json({ error: 'No authorization token provided' });
        }

        const auth_token = req.headers.authorization.split('Bearer ')[1];
        
        if (!auth_token) {
            return res.status(401).json({ error: 'Invalid token format' });
        }

        // Verify the token
        const { userId, email } = jwt.verify(auth_token, process.env.MY_SECRET_KEY);
        
        // Find user but exclude password
        const user = await User.findOne({ email }).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        // Attach user to request object
        req.user = user;
        next();
        
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        
        console.error('Auth middleware error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = authenticateToken;