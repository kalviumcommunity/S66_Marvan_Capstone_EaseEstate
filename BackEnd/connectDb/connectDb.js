const mongoose = require("mongoose")

const connectDb = async () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Successfully connected to MongoDB");
        })
        .catch((error) => {
            console.log(`Error: ${error.message}`);
            process.exit(1);
        });
};

module.exports = connectDb;