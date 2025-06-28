# Employee Attendance Management System

A simple fullstack application to track and manage employee attendance using OTP verification and geofencing.

## Features

- Employee login with OTP authentication
- Mark attendance with location verification
- Admin dashboard to view and manage attendance records
- Role-based access control (Admin & Employee)

## Tech Stack

- Backend: Node.js, Express
- Frontend: React (or your chosen frontend framework)
- Database: MongoDB (or your choice)

## Admin Seed Script

This script seeds a default Admin user into the database using credentials stored in environment variables.

### Purpose

- Automatically create an initial admin account for the Employee Attendance Tracking System.
- Prevents duplicate admin creation if an admin with the specified email already exists.
- Hashes the admin password securely before saving.

### Setup

Ensure you have the following environment variables configured in your `.env` file:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_password
MONGO_URI=your_mongodb_uri
```

Run node scripts/seedAdmin.js from the root of the backend directory.
