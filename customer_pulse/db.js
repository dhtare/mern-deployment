require("dotenv").config();
const mongoose = require("mongoose");

module.exports = async () => {
    try {
        const uri = process.env.MONGODB_URI.trim(); 
        
        await mongoose.connect(uri);
        console.log("Connected to database successfully");
    } catch (err) {
        console.error("Could not connect to database:", err.message);
        process.exit(1); 
    }
};