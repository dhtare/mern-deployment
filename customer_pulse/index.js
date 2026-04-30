require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require("./db");
const crudRoutes = require("./routes/crudRoutes");

const app = express();
const PORT = process.env.PORT || 8092;

// database connection
const startServer = async () => {
    try {
        await connection(); // Wait for DB
        
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}...`);
        });
    } catch (error) {
        console.log("Server failed to start:", error);
    }
};

startServer();


// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
	res.locals.path = req.path;
	next();
});

// routes
app.use("/api/cruds", crudRoutes);
//app.use("/api/auth", authRoute);

// listening on port
//app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
