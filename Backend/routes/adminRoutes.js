const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");
const verifyToken = require("../middleware/verifyToken");
const adminController = require("../controllers/adminController");

router.get("/employees", verifyToken, isAdmin, adminController.getEmployeeList);
router.get("/employees/attendance/records", verifyToken, isAdmin, adminController.getAttendanceRecords);
module.exports = router;
