
const jwt = require('jsonwebtoken');
const JWT_SECRET = '9a02115a835ee03d5fb83cd8a468ea33e4090aaaec87f53c9fa54512bbef4db8dc656c82a315fa0c785c08b0134716b81ddcd0153d2a7556f2e154912cf5675f'; // Make sure to use the same secret used for signing tokens

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Bearer scheme

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied, token missing!' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid token' });
        }
        
        req.user = user; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateToken;
