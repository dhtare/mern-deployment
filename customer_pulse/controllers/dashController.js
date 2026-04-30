const Crud = require("../models/crudModel");
const QRCode = require('qrcode');
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
// Display All CRUD Data
const chart_1 = async  (req, res) => {
	try {
        // Count occurrences of each satisfaction level (1 to 5)
        const counts = await Crud.aggregate([
			{
                $match: {
                    fq1: { $in: [1, 2, 3, 4, 5] } // Only consider valid values
                }
            },
            {
                $group: {
                    _id: { $toInt: "$fq1" }, // Convert string to integer for grouping
                    count: { $sum: 1 } // Count occurrences
                }
            },
            {
                $sort: { _id: 1 } // Sort by the satisfaction level
            }
        ]);

		 // Calculate total count
		 const totalCount = counts.reduce((sum, { count }) => sum + count, 0);

      // Prepare the final response structure
	  const categories = {
		1: "Very Unsatisfied",
		2: "Unsatisfied",
		3: "Neutral",
		4: "Satisfied",
		5: "Very Satisfied"
	};
          // Create an array for the response data
		  const data = Array.from({ length: 5 }, (_, i) => {
            const level = i + 1;
            const countEntry = counts.find(entry => entry._id === level);
            return {
                level: categories[level],
                count: countEntry ? countEntry.count : 0,
                percent : countEntry ? (countEntry.count !=0 ? (countEntry.count/totalCount)*100 :0).toFixed(0) : 0 // Default to 0 if not found
            };
        });

        // Send the response
        res.json({ success: true, totalCount :totalCount,data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }    
};

// Create New CRUD
const chart_2 = async (req, res) => {
	try {
        const categories = { 
            1: "Very Unsatisfied",
            2: "Unsatisfied",
            3: "Neutral",
            4: "Satisfied",
            5: "Very Satisfied"
        };

        // Aggregating counts of each fq1 value
        const results = await Crud.aggregate([
			{
                $match: {
                    fq1: { $in: [1, 2, 3, 4, 5] } // Only consider valid values
                }
            },
            {
                $group: {
                    _id: { $toInt: "$fq1" }, // Convert string to integer for grouping
                    count: { $sum: 1 } // Count occurrences
                }
            }
        ]);

        // Calculate total count
        const totalCount = results.reduce((sum, { count }) => sum + count, 0);

        // Prepare the data for the pie chart
        const pieChartData = Object.keys(categories).map(key => {
            const count = results.find(result => result._id.toString() === key) ? results.find(result => result._id.toString() === key).count : 0;
            const percentage = totalCount ? (count / totalCount) * 100 : 0; // Calculate percentage
            return {
                category: categories[key],
                count,
                percentage: percentage.toFixed(0) // Format to 2 decimal places
            };
        });

        res.json({ success: true, totalCount, data: pieChartData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Show a particular CRUD Detail by Id
const chart_3 = async (req, res) => {
    try {
        const satisfactionLabels = {
            4: 'Overall Satisfied',
            5: 'Overall Satisfied'
        };

        // Step 1: Aggregate total counts for all satisfaction levels
        const totalResults = await Crud.aggregate([
            {
                $group: {
                    _id: "$location",
                    totalCount: { $sum: 1 } // Total counts for each location
                },
            },
            {
                $sort: { _id: 1 }// Sort by the satisfaction level  
            }
        ]);

        // Step 2: Aggregate counts for categories 4 and 5
        const satisfiedResults = await Crud.aggregate([
            {
                $match: {
                    fq1: { $in: [4, 5] } // Filter only for categories 4 and 5
                }
            },
            {
                $group: {
                    _id: "$location",
                    satisfiedCount: { $sum: 1 } // Sum counts for categories 4 and 5
                }
            }
        ]);

        // Step 3: Combine results
        const combinedResults = totalResults.map(total => {
            const satisfied = satisfiedResults.find(s => s._id === total._id);
            const satisfiedCount = satisfied ? satisfied.satisfiedCount : 0;
            const percent = total.totalCount ? (satisfiedCount / total.totalCount) * 100 : 0;

            return {
                location: total._id,
                labels: [satisfactionLabels[4]], // Use "Overall Satisfied" as label
                data: { [satisfactionLabels[4]]: satisfiedCount },
                percent: percent.toFixed(0) // Format percentage to 2 decimal places
            };
        });

        res.status(200).json({
            success: true,
            data: combinedResults
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching data",
            error: error.message
        });
    }
};

// Update CRUD Detail by Id
const chart_4 = async (req, res) => {
	try {

		const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
		  // Array of month names
		  const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Aggregating average of fq1 values grouped by month
        const results = await Crud.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    averageFq1: { $avg: { $toInt: "$fq1" } } // Convert fq1 to integer and calculate average
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } // Sort results by year and month
            }
        ]);

       // console.log(results);

        // Format results to a more usable structure
        const monthlyData = results.map(result => ({
			year: result._id.year !== null ? result._id.year : currentYear,
			month: result._id.month ? monthNames[result._id.month] : monthNames[currentMonth], // Get month name
            averageFq1: result.averageFq1.toFixed(0) // Format to 2 decimal places
        }));

        res.json({ success: true, data: monthlyData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete CRUD Detail by Id
const chart_5 = async(req, res) => {
	try {
        // Aggregating counts of fq2 values based on defined categories
        const results = await Crud.aggregate([
            {
                $group: {
                    _id: {
                        $cond: [
							{ $lte: [{ $toInt: "$fq2" }, 6] }, "Detractors", // 0-6: Detractors
							{
								$cond: [
									{ $lte: [{ $toInt: "$fq2" }, 8] }, "Passives",   // 7-8: Passives
									"Promoters" // 9-10: Promoters
								]
							}
						]
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Prepare the response data
        const categories = {
            "Detractors": 0,
            "Passives": 0,
            "Promoters": 0
        };

        // Fill the categories based on results
        results.forEach(result => {
            categories[result._id] = result.count;
        });

		 // Calculate total count of entries
		 let totalCount = 0;

		 // Fill the categories based on results
		 results.forEach(result => {
			 categories[result._id] = result.count;
			 totalCount += result.count; // Increment total count
		 });

        // Format data for bar chart
        const barChartData = [
            { category: "Detractors", count: categories["Detractors"] , percent : ((categories["Detractors"]/totalCount)*100).toFixed(0)},
            { category: "Passives", count: categories["Passives"],percent : ((categories["Passives"]/totalCount)*100).toFixed(0) },
            { category: "Promoters", count: categories["Promoters"], percent : ((categories["Promoters"]/totalCount)*100).toFixed(0)}
        ];

        res.json({ success: true, totalCount,data: barChartData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const chart_6 = async(req, res) => {
	try {
        // Aggregate counts based on fq2 categories
        const results = await Crud.aggregate([
            {
                $group: {
                    _id: {
                        $cond: [
                            { $lte: [{ $toInt: "$fq2" }, 6] }, "Detractors",
                            {
                                $cond: [
                                    { $lte: [{ $toInt: "$fq2" }, 8] }, "Passives",
                                    "Promoters"
                                ]
                            }
                        ]
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Prepare the response data
        const categories = {
            "Detractors": 0,
            "Passives": 0,
            "Promoters": 0
        };

        // Fill the categories based on results
        results.forEach(result => {
            categories[result._id] = result.count;
        });

        // Calculate conversion percentages
        const totalDetractors = categories["Detractors"];
        const totalPassives = categories["Passives"];
        const totalPromoters = categories["Promoters"];

        const conversionDetractorsToPassives = totalDetractors > 0
            ? ((totalPassives / totalDetractors) * 100).toFixed(0)
            : 0;

        const conversionPassivesToPromoters = totalPassives > 0
            ? ((totalPromoters / totalPassives) * 100).toFixed(0)
            : 0;

        // Prepare funnel chart data
        const funnelChartData = [
            { category: "Detractors to Passives", count: totalDetractors, conversionPercentage: conversionDetractorsToPassives },
            { category: "Passives to Promoters", count: totalPassives, conversionPercentage: conversionPassivesToPromoters }            
        ];

        res.json({ success: true, data: funnelChartData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const chart_7 = async (req, res) => {
    try {
        // Step 1: Fetch all responses and calculate NPS for each segment
        const results = await Crud.aggregate([
            {
                $group: {
                    _id: {
                        location: "$location",
                        counter: "$counter",
                    },
                    totalResponses: { $sum: 1 },
                    promoters: {
                        $sum: {
                            $cond: [{ $gte: [{ $toInt: "$fq2" }, 9] }, 1, 0]  // Count Promoters
                        }
                    },
                    detractors: {
                        $sum: {
                            $cond: [{ $lte: [{ $toInt: "$fq2" }, 6] }, 1, 0]  // Count Detractors
                        }
                    }
                }
            },
            {
                $project: {
                    location: "$_id.location",
                    counter: "$_id.counter",
                    totalResponses: 1,
                    promoters: 1,
                    detractors: 1,
                    nps:  {
                        $subtract: [
                            { $floor: { $multiply: [{ $divide: ["$promoters", "$totalResponses"] }, 100] } },
                            { $floor: { $multiply: [{ $divide: ["$detractors", "$totalResponses"] }, 100] } }
                        ]
                    }
                }
            },
            {
                $match: { totalResponses: { $gt: 0 } } // Exclude segments with no responses
            }
        ]);

        // Step 2: Format the response for the heat map
        const heatMapData = results.map(result => ({
            location: result.location || "Unknown", // Default to "Unknown" if location is null
            counter: result.counter || "Unknown",   // Default to "Unknown" if counter is null
            nps: result.nps
        }));

        res.json({ success: true, data: heatMapData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


const chart_8 = async (req,res)=>{
	try {

		const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
		  // Array of month names
		  const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const results = await Crud.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },  // Assuming you have a createdAt field
                        month: { $month: "$createdAt" }
                    },
                    totalResponses: { $sum: 1 },
                    promoters: {
                        $sum: {
                            $cond: [{ $gte: [{ $toInt: "$fq2" }, 9] }, 1, 0]  // Count Promoters
                        }
                    },
                    detractors: {
                        $sum: {
                            $cond: [{ $lte: [{ $toInt: "$fq2" }, 6] }, 1, 0]  // Count Detractors
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    totalResponses: 1,
                    promoters: 1,
                    detractors: 1,
                    percentagePromoters: { $multiply: [{ $divide: ["$promoters", "$totalResponses"] }, 100] },
                    percentageDetractors: { $multiply: [{ $divide: ["$detractors", "$totalResponses"] }, 100] },
                    nps: {
                        $floor: {
                            $subtract: [
                                { $multiply: [{ $divide: ["$promoters", "$totalResponses"] }, 100] },
                                { $multiply: [{ $divide: ["$detractors", "$totalResponses"] }, 100] }
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    year: "$_id.year",
                    month: "$_id.month",
                    totalResponses: 1,
                    promoters: 1,
                    detractors: 1,
                    nps: 1
                }
            },
            {
                $sort: { year: 1, month: 1 } // Sort by year and month
            }
        ]);

        // Format the response for the line chart
        const npsData = results.map(result => {
            const year = result.year || currentYear; // Use current year if null
            const month = result.month || currentMonth; // Use current month if null
            
            return {
                monthyear: `${monthNames[month - 1]}`, // Format as YYYY-MM
                nps: result.nps
            };
        });

        res.json({ success: true, data: npsData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const chart_9 = async (req, res) => {
    try {
        // Step 1: Fetch all responses from fq3
        const responses = await Crud.find({}, { fq3: 1 });

        // Step 2: Aggregate all text responses
        const text = responses.map(response => response.fq3).join(' ');

        // Step 3: Tokenize the text and count word frequencies
        const wordCounts = {};
        const words = text.toLowerCase().match(/\b\w+\b/g); // Regex to match words

        if (words) {
            words.forEach(word => {
                // Ignore common stop words (you can expand this list)
                const stopWords = ['the', 'and', 'is', 'in', 'to', 'with', 'a', 'of', 'for', 'on', 'that', 'it', 'as', 'by', 'this', 'are', 'was', 'at','i','not'];
                if (!stopWords.includes(word)) {
                    wordCounts[word] = (wordCounts[word] || 0) + 1;
                }
            });
        }

        // Step 3.1: Convert wordCounts to an array of objects for easier processing
        const totalWords = Object.values(wordCounts).reduce((sum, count) => sum + count, 0);

        // Step 4: Convert wordCounts to an array of objects for easier processing
        const wordCloudData = Object.entries(wordCounts).map(([word, count]) => ({
            text: word,
            value: count,
            percent: ((count / totalWords) * 100).toFixed(0)
        }));

        // Step 5: Sort by frequency
        wordCloudData.sort((a, b) => b.value - a.value);

        // Convert and log the result
        //const resultString = convertToTextCountString(wordCloudData);

        //console.log(resultString);  

        res.json({ success: true,total : totalWords, data: wordCloudData});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const chart_10 = async (req, res) => {
    try {
        // Step 1: Fetch all responses from fq3
        const responses = await Crud.find({}, { fq3: 1 });

        // Step 2: Initialize a theme mapping object
        const themeMapping = {
            "customer service": "Customer Service",
            "support": "Customer Service",
            "help": "Customer Service",
            "responsive": "Customer Service",
            "speed": "Speed",
            "delay": "Speed",
            "quick": "Speed",
            "fast": "Speed",
            "quality": "Quality",
            "satisfaction": "Quality",
            "excellent": "Quality",
            "poor": "Quality",
            "product": "Product Feedback",
            "feature": "Product Feedback",
            "functionality": "Product Feedback",
            "usability": "User Experience",
            "ease of use": "User Experience",
            "navigation": "User Experience",
            "design": "User Experience",
            "price": "Pricing",
            "cost": "Pricing",
            "value": "Pricing",
            "recommend": "Recommendations",
            "review": "Feedback",
            "feedback": "Feedback",
            "experience": "Overall Experience",
            "issue": "Issues",
            "problem": "Issues",
            "complaint": "Issues",
            "bug": "Technical Issues",
            "error": "Technical Issues",
            "downtime": "Technical Issues",
            // Add more keywords and their respective themes as needed
        };

        // Step 3: Count occurrences of each theme
        const themeCounts = {};

        responses.forEach(response => {
            const text = response.fq3.toLowerCase();
            for (const keyword in themeMapping) {
                if (text.includes(keyword)) {
                    const theme = themeMapping[keyword];
                    themeCounts[theme] = (themeCounts[theme] || 0) + 1;
                }
            }
        });

        // Step 4: Calculate total counts
        const totalThemes = Object.values(themeCounts).reduce((sum, count) => sum + count, 0);

        // Step 4: Convert themeCounts to an array of objects for the response
        const barChartData = Object.entries(themeCounts).map(([theme, count]) => ({
            theme,
            count,
            percent: ((count / totalThemes) * 100).toFixed(0) // Calculate percentage
        }));

        // Step 5: Sort by count
        barChartData.sort((a, b) => b.count - a.count);

        res.json({ success: true, data: barChartData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const headHounters = async (req, res) => {
    try {
        // Fetch all feedback responses
        const results = await Crud.find();

        const totalResponses = results.length;
        let detractorsCount = 0;
        let passivesCount = 0;
        let promotersCount = 0;

        // Iterate through responses and categorize them
        results.forEach(item => {
            const score = parseInt(item.fq2, 10); // Assuming fq1 is the score

            if (score >= 0 && score <= 6) {
                detractorsCount++;
            } else if (score >= 7 && score <= 8) {
                passivesCount++;
            } else if (score >= 9 && score <= 10) {
                promotersCount++;
            }
        });

        // Calculate percentages
        // Calculate percentages without decimals
        const percentagePromoters = totalResponses > 0 ? Math.floor((promotersCount / totalResponses) * 100) : 0;
        const percentageDetractors = totalResponses > 0 ? Math.floor((detractorsCount / totalResponses) * 100) : 0;
        const nps = percentagePromoters - percentageDetractors;
        // Format response
        res.status(200).json({
            success: true,
            data: {
                totalResponses,
                detractors: detractorsCount,
                passives: passivesCount,
                promoters: promotersCount,
                percentagePromoters,
                percentageDetractors,
                nps
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while calculating NPS",
            error: error.message
        });
    }
};

const chart_11 = async (req, res) => {
    try {
        // Fetch all documents from the collection
        const responses = await Crud.find();

        const totalResponses = responses.length;

        // Initialize counts
        let detractors = 0;
        let passives = 0;
        let promoters = 0;

        // Iterate through each response to calculate counts
        responses.forEach(response => {
            const score = parseInt(response.fq2); // Assuming fq2 is the NPS score
            
            if (score >= 0 && score <= 6) {
                detractors++;
            } else if (score >= 7 && score <= 8) {
                passives++;
            } else if (score >= 9 && score <= 10) {
                promoters++;
            }
        });

         // Calculate percentages as integers
         const percentagePromoters = Math.round((promoters / totalResponses) * 100) || 0;
         const percentageDetractors = Math.round((detractors / totalResponses) * 100) || 0;
 
         // Calculate NPS
         const nps = percentagePromoters - percentageDetractors;

        // Prepare the response
        res.status(200).json({
            success: true,
            nps: nps,
            percentagePromoters: percentagePromoters.toFixed(0),
            percentageDetractors: percentageDetractors.toFixed(0),
            totalResponses: totalResponses,
        });
    } catch (error) {
        console.error('Error calculating NPS:', error);
        res.status(500).json({  success: false, error: 'Internal server error' });
    }
};

const center_qr = async (req, res) => {
    const { url } = req.body;

    // Validate the URL
    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'A valid URL is required.' });
    }

    try {
        // Generate QR code
        //const qrCodeImageUrl = await QRCode.toDataURL(url);
        const qrCodeImageUrl = await generateQRCodeWithLogo(url,"public/ois_logo.png");
        // Send the QR code image as a response
         res.status(200).json({
            success: true,
            qr:qrCodeImageUrl});         
    } catch (err) {
        console.error(err);
        res.status(500).json({success: false, error: 'Failed to generate QR code.' });
    }
};




// Function to convert JSON to required string format
function convertToTextCountString(data) {
    return data.map(item => `${item.text}:${item.value}`).join(',');
}

async function generateQRCodeWithLogo(text, logoUrl) {
    const qrCodeSize = 300; // Size of the QR code
    const logoSize = 50; // Size of the logo
    const logoMargin = 5; // Margin around the logo

    // Generate the QR code as a data URL with high error correction
    const qrCodeDataURL = await QRCode.toDataURL(text, {
        width: qrCodeSize,
        margin: 2,
        errorCorrectionLevel: 'H', // Use high error correction
    });

    // Create a canvas to draw the QR code and logo
    const canvas = createCanvas(qrCodeSize, qrCodeSize);
    const ctx = canvas.getContext('2d');

    // Load the QR code image
    const qrCodeImage = await loadImage(qrCodeDataURL);
    ctx.drawImage(qrCodeImage, 0, 0, qrCodeSize, qrCodeSize);

    // Load the logo image
    const logoImage = await loadImage(logoUrl);
    const logoX = (qrCodeSize - logoSize) / 2; // Center the logo
    const logoY = (qrCodeSize - logoSize) / 2;

 // Draw a circle for the logo's background
    ctx.beginPath();
    ctx.arc(qrCodeSize / 2, qrCodeSize / 2, (logoSize + logoMargin) / 2, 0, Math.PI * 2);
    ctx.fillStyle = 'white'; // Background color for the logo
    ctx.fill();

     
    // Draw the logo on top of the QR code
    ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);

    // Return the final QR code image as a data URL
    return canvas.toDataURL();
}

module.exports = {
	chart_1,
	chart_2,
    chart_3,
	chart_4,
	chart_5,
	chart_6,
	chart_7,
	chart_8,
	chart_9,
	chart_10,
    chart_11,
    headHounters,
    center_qr
};
