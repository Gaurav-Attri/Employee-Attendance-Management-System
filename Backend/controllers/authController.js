const bcrypt = require('bcrypt');
const Employee = require('../models/Employee');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

const generateEmployeeId = async () => {
    let lastEmployeeId = await Employee.findOne().sort({employeeId : -1});
    return  lastEmployeeId ? lastEmployeeId.employeeId + 1 : 1000; // employeeId starts with 1000 
};

const registerEmployee = async (req, res) => {
    try{
        const {firstName, lastName, email, password} = req.body;
        if(!firstName || !lastName || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        const existing = await Employee.findOne({email});
        if(existing){
            return res.status(400).json({message: "Employee already exists"});
        }

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
        console.error("Employee Registeration Error: ", error);
        return res.status(500).json({message: "Server Error"});
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
    registerEmployee,
    loginUser
};