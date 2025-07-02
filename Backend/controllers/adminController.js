const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');

const getEmployeeList = async (req, res) => {
    try{    
        const employees = await Employee.find({}, '-hashedPassword -__v ');
        res.json(employees);
    }catch(error){
        console.error("Error fetching employee list:", error);
        return res.status(500).json({message: "Server Error"});
    }
}

const getAttendanceRecords = async (req, res) => {
    try{
        const {employeeId, date} = req.query;
        const query = {};

        // converting numeric employeeId to objectId
        if(employeeId){
            const employee = await Employee.findOne({employeeId: Number(employeeId)});
            if(!employee){
                return res.status(404).json({message: "Employee Not Found."});
            }
            query.employeeId = employee._id;
        }

        if(date){
            const dayStart = new Date(date);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(date);
            dayEnd.setHours(23, 59, 59, 999);

            query.clockInTime = {$gte: dayStart, $lte: dayEnd};
        }

        const records = await Attendance.find(query).populate("employeeId", "firstName lastName email employeeId").sort({clockInTime: -1});

        return res.json(records);

    }catch(error){
        console.error("Error Fetching attendance records.", error);
        return res.status(500).json({message: "Server Error"});
    }
}

module.exports = {
    getEmployeeList,
    getAttendanceRecords
};