const User = require('../models/userModel'); // Adjust the path according to your project structure
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = '9a02115a835ee03d5fb83cd8a468ea33e4090aaaec87f53c9fa54512bbef4db8dc656c82a315fa0c785c08b0134716b81ddcd0153d2a7556f2e154912cf5675f'; // Use a secure secret and consider storing it in an environment variable

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '10h' });

        // Send response
        res.json({
            success: true,
            message: 'Login successful',
            token, // Send the token to the client
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    login
};
