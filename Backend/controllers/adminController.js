const Employee = require('../models/Employee');

const getEmployeeList = async (req, res) => {
    try{    
        const employees = await Employee.find({}, '-hashedPassword -__v ');
        res.json(employees);
    }catch(error){
        console.error("Error fetching employee list:", error);
        return res.status(500).json({message: "Server Error"});
    }
}

module.exports = {
    getEmployeeList
};