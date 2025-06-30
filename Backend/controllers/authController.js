const bcrypt = require('bcrypt');
const Employee = require('../models/Employee');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const generateOTP = require('../utils/generateOTP');
const transporter = require('../utils/emailTransporter');
const config = require('../config/appConfig');

const generateEmployeeId = async () => {
    let lastEmployeeId = await Employee.findOne().sort({employeeId : -1});
    return  lastEmployeeId ? lastEmployeeId.employeeId + 1 : 1000; // employeeId starts with 1000 
};

// In-memory store for pending registration
// Key: email, Value: {employeeData, OTP, expiresAt}
const pendingRegistrations = new Map();

const initiateEmployeeRegistration = async (req, res) => {
    try{
        const {firstName, lastName, email, password} = req.body;
        if(!firstName || !lastName || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        const existing = await Employee.findOne({email});
        if(existing){
            return res.status(400).json({message: "Employee with this email already exists"});
        }

        if(pendingRegistrations.has(email)){
            return res.status(429).json({message: "Registration already initiated. Please verify OTP sent to email."});
        }

        const otp = generateOTP();
        const expiresAt = Date.now() + 3*60*1000;

        pendingRegistrations.set(email, {
            employeeData: {firstName, lastName, email, password},
            otp,
            expiresAt
        });

        const mailOptions = {
            from: config.smtp_from_email,
            to: email,
            subject: "Your OTP for employee Registration",
            text: `Hello ${firstName},\n\nYour OTP to complete registration is: ${otp}\nIt will expire in three minutes.\n\nIf you did not request this, please ignore this email.`
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({message: "OTP sent to employee email. Please Verify to complete registration."});
    }catch(error){
        console.error("Error initiating employee registration: ", error);
        return res.status(500).json({message: "Server Error"});
    }
}

const verifyEmployeeRegistration = async (req, res) => {
    try{
        const {email, otp} = req.body;

        if(!email || !otp){
            return res.status(400).json({message: "Email and OTP are required"});
        }

        const pending = pendingRegistrations.get(email);
        if(!pending){
            return res.status(400).json({message: "No pending registration found for this email. Please initiate registration again."});
        }

        if(Date.now() > pending.expiresAt){
            pendingRegistrations.delete(email);
            return res.status(410).json({message: "OTP expired. Please initiate registration again."});
        }

        if(otp !== pending.otp){
            return res.status(401).json({message: "Invalid OTP. Please try again."});
        }

        const {firstName, lastName, password} = pending.employeeData;

        const hashedPassword = await bcrypt.hash(password, 10);
        const employeeId = await generateEmployeeId();

        const newEmployee = new Employee(
            {
            firstName,
            lastName,
            email,
            hashedPassword,
            employeeId,
        });

        await newEmployee.save();
        pendingRegistrations.delete(email);

        return res.status(201).json({
            message: "Employee registered successfully",
            employee: {
                id: newEmployee._id,
                employeeId: newEmployee.employeeId,
                email: newEmployee.email,
                name: `${newEmployee.firstName} ${newEmployee.lastName}`
            }
        });
    }catch(error){
        console.error("Error verifying OTP and registering employee: ", error);
        return res.status(500).json({message: 'Server Error'});
    }
}


const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Email and password are required"});
        }

        let user = await Admin.findOne({email});
        let role = 'admin';

        if(!user){
            user = await Employee.findOne({email});
            role = 'employee';
        }

        if(!user){
            return res.status(401).json({message: "Invalid Credentials"});
        }

        if(role === "employee" && user.isActive === false){
            return res.status(403).json({message: "Your account has been deactivated"});
        }

        const isMatch = await bcrypt.compare(password, user.hashedPassword);
        if(!isMatch){
            return res.status(401).json({message: "Invalid Credentials"});
        }

        if(!user.role) user.role = role;

        const token = generateToken(user);

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                role: user.role
            }
        });
    }catch(error){
        console.error("Login Error: ", error);
        return res.status(500).json({message: "Server Error"});
    }
};

module.exports = {
    loginUser,
    initiateEmployeeRegistration,
    verifyEmployeeRegistration
};