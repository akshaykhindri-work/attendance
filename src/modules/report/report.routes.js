const express = require("express");

const router = express.Router();

const authMiddleware = require("../auth/auth.middleware");

const {
    getDailyReport,
    getMonthlyReport,
    getEmployeeHistory,
    getDepartmentReport,
    getMonthlyAttendanceMatrix
} = require("./report.controller");

router.use(authMiddleware);

// Daily Report
router.get(
    "/daily/:date",
    getDailyReport
);

// Monthly Report
router.get(
    "/monthly/:year/:month",
    getMonthlyReport
);

// Employee History
router.get(
    "/employee/:employeeId",
    getEmployeeHistory
);

// Department Report
router.get(
    "/department/:departmentId/:date",
    getDepartmentReport
);

// Monthly Attendance Matrix
router.get(
    "/monthly-matrix/:year/:month",
    getMonthlyAttendanceMatrix
);

module.exports = router;