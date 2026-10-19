const express =
    require("express");


const router =
    express.Router();


const authMiddleware =
    require("../auth/auth.middleware");


const {
    attendanceValidator
} = require("./attendance.validator");


const {
    createAttendance,
    getAttendanceByDate,
    updateAttendance,
    loadAttendanceSheet
} = require("./attendance.controller");


// ==========================================
// AUTHENTICATION
// ==========================================

router.use(
    authMiddleware
);


// ==========================================
// ATTENDANCE SHEET
// ==========================================
//
// All shifts:
//
// GET /api/attendance/sheet/2026-08-12
//
// Day only:
//
// GET /api/attendance/sheet/2026-08-12?shift=Day
//
// Night only:
//
// GET /api/attendance/sheet/2026-08-12?shift=Night
//

router.get(
    "/sheet/:date",
    loadAttendanceSheet
);


// ==========================================
// GET ATTENDANCE
// ==========================================
//
// All shifts:
//
// GET /api/attendance/2026-08-12
//
// Day:
//
// GET /api/attendance/2026-08-12?shift=Day
//
// Night:
//
// GET /api/attendance/2026-08-12?shift=Night
//

router.get(
    "/:date",
    getAttendanceByDate
);


// ==========================================
// CREATE ATTENDANCE
// ==========================================

router.post(
    "/",
    attendanceValidator,
    createAttendance
);


// ==========================================
// UPDATE ATTENDANCE
// ==========================================

router.put(
    "/:id",
    attendanceValidator,
    updateAttendance
);


module.exports =
    router;