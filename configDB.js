const mongoose = require('mongoose');

const USER_NAME = "admin";
const URI = process.env.MONGODB_URI;

module.exports = connectDB = async() => {
    try {
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connecting to DB successfully!");
    }
    catch(error) {
        console.error(error);
    }
};