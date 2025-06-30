const nodemailer = require('nodemailer');
const config = require('../config/appConfig');

const transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: Number(config.smtp_port),
    secure: config.smtp_secure === "true",
    auth: {
        user: config.smtp_user,
        pass: config.smtp_pass
    },
});

module.exports = transporter;