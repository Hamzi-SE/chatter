const mongoose = require("mongoose");

const connectDatabase = async () => {
    try {
        mongoose.set("strictQuery", false);
        const data = await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected with ${data.connection.db.databaseName} database`);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDatabase;
