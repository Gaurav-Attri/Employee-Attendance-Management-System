const mongoose = require('mongoose');
const config = require('./config/appConfig');

const connectDB = async() => {
    try{
        await mongoose.connect(config.mongo_uri);
        console.log("MongoDB connected Successfully");
    }
    catch(error){
        console.error("Error Connecting to MongoDB: ", error);
        process.exit(1);
    }
}

module.exports = connectDB;