const app = require('./app');

// Setting up config file
require("dotenv").config({ path: "config/config.env" });

// Setting up database connection
const connectDatabase = require("./config/database");

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.log(`ERROR: ${err.stack}`);
    console.log("Shutting down due to uncaught exception");
    process.exit(1);
})


//Make a get request to the server
app.get('/', (req, res) => {
    res.send('Backend working fine')
})

// Connecting to database
connectDatabase();


const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
});


// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log(`ERROR: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise rejection");

    server.close(() => {
        process.exit(1);
    });
});