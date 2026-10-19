const reportService = require("./report.service");

const {
    successResponse,
    errorResponse
} = require("../../utils/apiResponse");

// Daily Report
exports.getDailyReport = async (req, res) => {

    try {

        const report = await reportService.getDailyReport(
            req.params.date
        );

        return successResponse(
            res,
            200,
            "Daily report generated successfully.",
            report
        );

    } catch (error) {

        return errorResponse(
            res,
            400,
            error.message
        );

    }

};

// Monthly Report
exports.getMonthlyReport = async (req, res) => {

    try {

        const report = await reportService.getMonthlyReport(
            req.params.year,
            req.params.month
        );

        return successResponse(
            res,
            200,
            "Monthly report generated successfully.",
            report
        );

    } catch (error) {

        return errorResponse(
            res,
            400,
            error.message
        );

    }

};

// Employee History
exports.getEmployeeHistory = async (req, res) => {

    try {

        const report = await reportService.getEmployeeHistory(
            req.params.employeeId
        );

        return successResponse(
            res,
            200,
            "Employee history generated successfully.",
            report
        );

    } catch (error) {

        return errorResponse(
            res,
            400,
            error.message
        );

    }

};

// Department Report
exports.getDepartmentReport = async (req, res) => {

    try {

        const report = await reportService.getDepartmentReport(
            req.params.departmentId,
            req.params.date
        );

        return successResponse(
            res,
            200,
            "Department report generated successfully.",
            report
        );

    } catch (error) {

        return errorResponse(
            res,
            400,
            error.message
        );

    }

};

// ==========================================
// Monthly Attendance Matrix
// ==========================================

exports.getMonthlyAttendanceMatrix = async (
    req,
    res
) => {

    try {

        const report =
            await reportService
                .getMonthlyAttendanceMatrix(
                    req.params.year,
                    req.params.month
                );


        return successResponse(
            res,
            200,
            "Monthly attendance matrix generated successfully.",
            report
        );


    } catch (error) {

        return errorResponse(
            res,
            400,
            error.message
        );

    }

};

