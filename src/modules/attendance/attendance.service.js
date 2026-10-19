const Attendance =
    require("./attendance.model");

const Employee =
    require("../employee/employee.model");


// ==========================================
// NORMALIZE SHIFT
// ==========================================

const normalizeShift = (
    shift
) => {

    return shift === "Night"
        ? "Night"
        : "Day";

};


// ==========================================
// NORMALIZE LEGACY STATUS
// ==========================================
//
// Old records may contain:
//
// Double Shift
//
// We keep them readable.
//
// New records cannot create this status.
//

const normalizeStatus = (
    status
) => {

    if (
        [
            "Present",
            "Half Day",
            "Absent",
            "Holiday",
            "Not Assigned",
            "Double Shift"
        ].includes(status)
    ) {

        return status;

    }


    return "Not Assigned";

};


// ==========================================
// POPULATE EMPLOYEE
// ==========================================

const employeePopulate = [

    {
        path: "employee",

        select:
            "employeeId fullName department designation",

        populate: [

            {
                path: "department",

                select: "name"

            },

            {
                path: "designation",

                select: "name"

            }

        ]

    }

];


// ==========================================
// CREATE ATTENDANCE
// ==========================================

const createAttendance = async (
    data
) => {

    const employee =
        await Employee.findOne({

            employeeId:
                data.employeeId,

            isActive:
                true

        });


    if (!employee) {

        throw new Error(
            "Employee not found."
        );

    }


    const attendanceDate =
        new Date(
            data.date
        );


    attendanceDate.setHours(
        0,
        0,
        0,
        0
    );


    const shift =
        normalizeShift(
            data.shift
        );


    const status =
        normalizeStatus(
            data.status
        );


    // ======================================
    // CHECK DUPLICATE
    // ======================================

    const exists =
        await Attendance.findOne({

            employee:
                employee._id,

            date:
                attendanceDate,

            shift

        });


    if (exists) {

        throw new Error(
            `Attendance already marked for ${shift} shift for this employee.`
        );

    }


    try {

        const attendance =
            await Attendance.create({

                employee:
                    employee._id,

                date:
                    attendanceDate,

                shift,

                status,

                remarks:
                    data.remarks || ""

            });


        return await Attendance
            .findById(
                attendance._id
            )
            .populate(
                employeePopulate
            );

    } catch (error) {

        if (
            error.code === 11000
        ) {

            throw new Error(
                `Attendance already marked for ${shift} shift for this employee.`
            );

        }


        throw error;

    }

};


// ==========================================
// GET ATTENDANCE BY DATE
// ==========================================
//
// Optional query:
//
// /api/attendance/2026-08-12?shift=Day
//
// /api/attendance/2026-08-12?shift=Night
//
// Without shift, both shifts are returned.
//

const getAttendanceByDate = async (
    date,
    requestedShift = null
) => {

    const start =
        new Date(
            date
        );


    start.setHours(
        0,
        0,
        0,
        0
    );


    const end =
        new Date(
            date
        );


    end.setHours(
        23,
        59,
        59,
        999
    );


    const query = {

        date: {

            $gte: start,

            $lte: end

        }

    };


    if (
        requestedShift === "Day" ||
        requestedShift === "Night"
    ) {

        query.shift =
            requestedShift;

    }


    return await Attendance
        .find(query)
        .populate(
            employeePopulate
        )
        .sort({

            employee: 1,

            shift: 1

        });

};


// ==========================================
// UPDATE ATTENDANCE
// ==========================================

const updateAttendance = async (
    id,
    data
) => {

    const currentAttendance =
        await Attendance.findById(
            id
        );


    if (!currentAttendance) {

        return null;

    }


    // ======================================
    // DATE
    // ======================================

    let attendanceDate =
        currentAttendance.date;


    if (data.date) {

        attendanceDate =
            new Date(
                data.date
            );


        attendanceDate.setHours(
            0,
            0,
            0,
            0
        );

    }


    // ======================================
    // SHIFT
    // ======================================

    const shift =
        normalizeShift(
            data.shift ||
            currentAttendance.shift
        );


    // ======================================
    // CHECK DUPLICATE
    // ======================================

    const exists =
        await Attendance.findOne({

            _id: {
                $ne: id
            },

            employee:
                currentAttendance.employee,

            date:
                attendanceDate,

            shift

        });


    if (exists) {

        throw new Error(
            `Attendance already exists for this employee on this date and ${shift} shift.`
        );

    }


    // ======================================
    // BUILD UPDATE
    // ======================================

    const updateData = {

        ...data,

        date:
            attendanceDate,

        shift,

        status:
            normalizeStatus(
                data.status ||
                currentAttendance.status
            )

    };


    return await Attendance
        .findByIdAndUpdate(

            id,

            updateData,

            {
                new: true,

                runValidators: true
            }

        )
        .populate(
            employeePopulate
        );

};


// ==========================================
// LOAD ATTENDANCE SHEET
// ==========================================
//
// This returns EVERY active employee TWICE:
//
// Employee 1 → Day
// Employee 1 → Night
//
// Missing records are represented as:
//
// status = Not Assigned
//
// No placeholder documents are inserted
// into MongoDB.
//

const loadAttendanceSheet = async (
    date,
    requestedShift = null
) => {

    const start =
        new Date(
            date
        );


    start.setHours(
        0,
        0,
        0,
        0
    );


    const end =
        new Date(
            date
        );


    end.setHours(
        23,
        59,
        59,
        999
    );


    // ======================================
    // EMPLOYEES
    // ======================================

    const employees =
        await Employee.find({

            isActive:
                true

        })

        .populate(
            "department",
            "name"
        )

        .populate(
            "designation",
            "name"
        )

        .sort({

            fullName:
                1

        });


    // ======================================
    // ATTENDANCE
    // ======================================

    const attendance =
        await Attendance.find({

            date: {

                $gte:
                    start,

                $lte:
                    end

            }

        });


    // ======================================
    // MAP
    // ======================================
    //
    // employeeId
    //    ↓
    // shift
    //    ↓
    // record
    //

    const attendanceMap =
        new Map();


    attendance.forEach(
        record => {

            const employeeKey =
                record.employee.toString();


            const shift =
                normalizeShift(
                    record.shift
                );


            if (
                !attendanceMap.has(
                    employeeKey
                )
            ) {

                attendanceMap.set(
                    employeeKey,
                    new Map()
                );

            }


            attendanceMap
                .get(
                    employeeKey
                )
                .set(
                    shift,
                    record
                );

        }
    );


    // ======================================
    // BUILD SHEET
    // ======================================

    const sheet = [];


    for (
        const employee
        of employees
    ) {

        const employeeKey =
            employee._id.toString();


        const employeeAttendance =
            attendanceMap.get(
                employeeKey
            ) || new Map();


        const shifts =
            requestedShift === "Day" ||
            requestedShift === "Night"

                ? [
                    requestedShift
                ]

                : [
                    "Day",
                    "Night"
                ];


        for (
            const shift
            of shifts
        ) {

            const record =
                employeeAttendance.get(
                    shift
                );


            sheet.push({

                employeeId:
                    employee.employeeId,

                fullName:
                    employee.fullName,

                department:
                    employee.department,

                designation:
                    employee.designation,

                shift,

                status:
                    record
                        ? normalizeStatus(
                            record.status
                        )
                        : "Not Assigned",

                remarks:
                    record
                        ? record.remarks || ""
                        : "",

                attendanceId:
                    record
                        ? record._id
                        : null

            });

        }

    }


    return sheet;

};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {

    createAttendance,

    getAttendanceByDate,

    updateAttendance,

    loadAttendanceSheet

};