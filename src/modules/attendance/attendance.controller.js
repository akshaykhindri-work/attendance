const attendanceService =
    require("./attendance.service");


const {
    successResponse,
    errorResponse
} = require("../../utils/apiResponse");


// ==========================================
// CREATE ATTENDANCE
// ==========================================

exports.createAttendance = async (
    req,
    res
) => {

    try {

        const attendance =
            await attendanceService
                .createAttendance(
                    req.body
                );


        return successResponse(

            res,

            201,

            "Attendance saved successfully.",

            attendance

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
// GET ATTENDANCE BY DATE
// ==========================================

exports.getAttendanceByDate =
    async (
        req,
        res
    ) => {

        try {

            const attendance =
                await attendanceService
                    .getAttendanceByDate(

                        req.params.date,

                        req.query.shift
                    );


            return successResponse(

                res,

                200,

                "Attendance fetched successfully.",

                attendance

            );

        } catch (error) {

            return errorResponse(

                res,

                500,

                error.message

            );

        }

    };


// ==========================================
// UPDATE ATTENDANCE
// ==========================================

exports.updateAttendance = async (
    req,
    res
) => {

    try {

        const attendance =
            await attendanceService
                .updateAttendance(

                    req.params.id,

                    req.body

                );


        if (!attendance) {

            return errorResponse(

                res,

                404,

                "Attendance not found."

            );

        }


        return successResponse(

            res,

            200,

            "Attendance updated successfully.",

            attendance

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
// LOAD ATTENDANCE SHEET
// ==========================================

exports.loadAttendanceSheet =
    async (
        req,
        res
    ) => {

        try {

            const sheet =
                await attendanceService
                    .loadAttendanceSheet(

                        req.params.date,

                        req.query.shift
                    );


            return successResponse(

                res,

                200,

                "Attendance sheet loaded successfully.",

                sheet

            );

        } catch (error) {

            return errorResponse(

                res,

                500,

                error.message

            );

        }

    };