const express = require('express');
const config = require('./config/appConfig');
const connectDB = require('./config/db');

const app = express();

connectDB().then(() => {
    app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
    });
});