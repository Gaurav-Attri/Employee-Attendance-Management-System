const express = require('express');
const config = require('./config/appConfig');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/admin', adminRoutes);

connectDB().then(() => {
    app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
    });
});