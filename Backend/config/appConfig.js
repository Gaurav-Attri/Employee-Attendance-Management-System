require('dotenv').config();

const appConfig = {
    port: process.env.PORT || 5000,
    mongo_uri: process.env.MONGO_URI
}

if(!appConfig.mongo_uri){
    throw new Error("MONGO_URI environment variable is required.");
}

module.exports = appConfig;