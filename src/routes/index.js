const express = require("express");
const reportRoutes = require("../modules/report/report.routes");
const router = express.Router();

router.use("/auth", require("../modules/auth/auth.routes"));
router.use("/departments", require("../modules/department/department.routes"));
router.use("/designations", require("../modules/designation/designation.routes"));
router.use("/employees", require("../modules/employee/employee.routes"));
router.use("/attendance", require("../modules/attendance/attendance.routes"));
router.use("/dashboard", require("../modules/dashboard/dashboard.routes"));
router.use("/reports", reportRoutes);

module.exports = router;



