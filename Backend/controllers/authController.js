const bcrypt = require('bcrypt');
const Employee = require('../models/Employee');

const generateEmployeeId = async () => {
    let lastEmployeeId = await Employee.findOne().sort({employeeId : -1});
    return  lastEmployeeId ? lastEmployeeId + 1 : 1000; // employeeId starts with 1000 
};

registerEmployee = async (req, res) => {
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

module.exports = {
    registerEmployee
};