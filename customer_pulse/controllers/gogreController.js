const User = require('../models/userModel'); // Adjust the path according to your project structure
const bcrypt = require('bcryptjs');
const axios = require('axios');
const genrateQr = async (req, res) => {
    const longUrl = req.body;
     try {
        
        
        res.status(200).json({ resp: longUrl });
      
          
        
    } catch (error) {
        console.error('Error creating short URL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    genrateQr,
};
