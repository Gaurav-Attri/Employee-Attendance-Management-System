require('dotenv').config();

const appConfig = {
    port: process.env.PORT || 5000,
    mongo_uri: process.env.MONGO_URI,
    admin_password: process.env.ADMIN_PASSWORD,
    admin_email: process.env.ADMIN_EMAIL
}

if(!appConfig.mongo_uri){
    throw new Error("MONGO_URI environment variable is required");
}

if(!appConfig.admin_email){
    throw new Error("ADMIN_EMAIL environment variable is required");
}

if(!appConfig.admin_password){
    throw new Error("ADMIN_PASSWORD environment variable is required");
}

module.exports = appConfig;