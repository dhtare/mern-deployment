const axios = require('axios');
const UrlModel = require("../models/urlModel");
// Your Short.io API key
const API_KEY = process.env.SHORT_IO_API_KEY; // Make sure to set this in your environment variables
const SHORT_IO_BASE_URL = 'https://api.short.io/links';

class UrlController {
    // Method to create a short URL
    static async createShortUrl(req, res) {
        const { originalURL } = req.body;

        try {
            const response = await axios.post(`${SHORT_IO_BASE_URL}/links`, {
                originalURL: originalURL,
            }, {
                headers: {
                    'Authorization': API_KEY,
                    'Content-Type': 'application/json',
                },
            });

            const shortUrl = response.data.shortURL; // The created short URL
            res.status(201).json({ shortUrl });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create short URL' });
        }
    }

    // Method to get hit analysis of a short URL
    static async getUrlAnalytics(req, res) {
        const { shortUrlId } = req.params; // Assume shortUrlId is passed as a URL parameter

        try {
            const response = await axios.get(`${SHORT_IO_BASE_URL}/links/${shortUrlId}/analytics`, {
                headers: {
                    'Authorization': API_KEY,
                },
            });

            const analytics = response.data; // The hit analysis data
            res.status(200).json(analytics);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to retrieve URL analytics' });
        }
    }

    static async createFeedUrl(req, res) {
        try {
            // Fetch all records from the database
            const entries = await UrlModel.find();
        
            // Check if there are entries
            if (entries.length === 0) {
              return res.status(404).json({ message: 'No records found' });
            }
        
            // Array to hold updated entries
            const updatedEntries = [];

            const { baseUrl } = req.body;

            console.log(baseUrl);
        
            // Iterate over each entry to generate and save the unique_url if it's empty
            for (const entry of entries) {

                console.log(entry);

              const { center, service, unique_id, unique_url } = entry;
        
              console.log(center);

              // Check if unique_url is already set
              
                // Construct the unique URL
                const newUniqueUrl = `${baseUrl}?center=${encodeURIComponent(center)}&service=${encodeURIComponent(service)}&unique_id=${encodeURIComponent(unique_id)}`;
        
                // Update the unique_url field
                entry.unique_url = newUniqueUrl;
        
                // Save the updated document
                const updatedEntry = await entry.save();
                updatedEntries.push(updatedEntry);
              
            }
        
            // Send a success response
            res.status(200).json({
              message: 'Unique URLs generated and saved successfully',
              data: updatedEntries,
            });
          } catch (error) {
            console.error('Error generating URLs:', error);
            res.status(500).json({
              message: 'Internal server error',
              error: error.message,
            });
          }
    }
}






module.exports = UrlController;
