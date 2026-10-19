const Attendance =
    require("../attendance/attendance.model");

const Employee =
    require("../employee/employee.model");


// ==========================================
// HELPERS
// ==========================================

function normalizeShift(shift) {

    return shift === "Night"
        ? "Night"
        : "Day";

}


function normalizeStatus(status) {

    const allowed = [
        "Present",
        "Half Day",
        "Absent",
        "Holiday",
        "Not Assigned"
    ];

    if (
        allowed.includes(status)
    ) {
        return status;
    }

    /*
     * Legacy records:
     *
     * Old records did not have a shift and
     * may contain Double Shift.
     *
     * Missing shift is treated as Day.
     * Double Shift is kept readable here.
     */

    if (status === "Double Shift") {
        return "Double Shift";
    }

    return "Not Assigned";
}


function getDaysInMonth(
    year,
    month
) {

    return new Date(
        Number(year),
        Number(month),
        0
    ).getDate();

}


// ==========================================
// DAILY REPORT
// ==========================================

const getDailyReport = async (
    date
) => {

    const start =
        new Date(date);

    start.setHours(
        0,
        0,
        0,
        0
    );


    const end =
        new Date(date);

    end.setHours(
        23,
        59,
        59,
        999
    );


    return await Attendance
        .find({
            date: {
                $gte: start,
                $lte: end
            }
        })

        .populate({
            path: "employee",

            select:
                "employeeId fullName department designation",

            populate: [
                {
                    path: "department",

                    select:
                        "name"
                },
                {
                    path: "designation",

                    select:
                        "name"
                }
            ]
        })

        .sort({
            employee: 1,
            shift: 1
        });

};


// ==========================================
// MONTHLY SUMMARY
// ==========================================

const getMonthlyReport = async (
    year,
    month
) => {

    const start =
        new Date(
            Number(year),
            Number(month) - 1,
            1
        );


    const end =
        new Date(
            Number(year),
            Number(month),
            1
        );


    const attendance =
        await Attendance.find({

            date: {
                $gte: start,
                $lt: end
            }

        });


    const summary = {

        present: 0,

        absent: 0,

        halfDay: 0,

        holiday: 0,

        notAssigned: 0,

        totalMarked: 0

    };


    attendance.forEach(
        record => {

            const status =
                normalizeStatus(
                    record.status
                );


            switch (status) {

                case "Present":

                    summary.present++;

                    summary.totalMarked++;

                    break;


                case "Absent":

                    summary.absent++;

                    summary.totalMarked++;

                    break;


                case "Half Day":

                    summary.halfDay++;

                    summary.totalMarked++;

                    break;


                case "Holiday":

                    summary.holiday++;

                    summary.totalMarked++;

                    break;


                case "Not Assigned":

                    summary.notAssigned++;

                    break;


                case "Double Shift":

                    /*
                     * Legacy historical record.
                     *
                     * Do not count it as a new
                     * status in the new UI.
                     */

                    break;

            }

        }
    );


    return summary;

};


// ==========================================
// EMPLOYEE HISTORY
// ==========================================

const getEmployeeHistory = async (
    employeeId
) => {

    const employee =
        await Employee.findOne({

            employeeId,

            isActive: true

        });


    if (!employee) {

        throw new Error(
            "Employee not found."
        );

    }


    const attendance =
        await Attendance
            .find({

                employee:
                    employee._id

            })

            .sort({

                date: -1,

                shift: 1

            });


    return {

        employeeId:
            employee.employeeId,

        fullName:
            employee.fullName,

        attendance

    };

};


// ==========================================
// DEPARTMENT REPORT
// ==========================================

const getDepartmentReport = async (
    departmentId,
    date
) => {

    const start =
        new Date(date);

    start.setHours(
        0,
        0,
        0,
        0
    );


    const end =
        new Date(date);

    end.setHours(
        23,
        59,
        59,
        999
    );


    const employees =
        await Employee
            .find({

                department:
                    departmentId,

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

                fullName: 1

            });


    const attendance =
        await Attendance.find({

            date: {

                $gte:
                    start,

                $lte:
                    end

            }

        });


    /*
     * employeeId
     *    ↓
     * Day
     *    ↓
     * record
     *
     * employeeId
     *    ↓
     * Night
     *    ↓
     * record
     */

    const attendanceMap =
        new Map();


    attendance.forEach(
        record => {

            const employeeKey =
                record.employee
                    .toString();


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
                .get(employeeKey)
                .set(
                    shift,
                    record
                );

        }
    );


    return employees.map(
        employee => {

            const employeeKey =
                employee._id.toString();


            const employeeAttendance =
                attendanceMap.get(
                    employeeKey
                ) || new Map();


            const dayRecord =
                employeeAttendance.get(
                    "Day"
                );


            const nightRecord =
                employeeAttendance.get(
                    "Night"
                );


            return {

                employeeId:
                    employee.employeeId,

                fullName:
                    employee.fullName,

                department:
                    employee.department,

                designation:
                    employee.designation,

                shifts: {

                    Day: {

                        status:
                            dayRecord
                                ? normalizeStatus(
                                    dayRecord.status
                                )
                                : "Not Assigned",

                        remarks:
                            dayRecord
                                ? dayRecord.remarks || ""
                                : ""

                    },

                    Night: {

                        status:
                            nightRecord
                                ? normalizeStatus(
                                    nightRecord.status
                                )
                                : "Not Assigned",

                        remarks:
                            nightRecord
                                ? nightRecord.remarks || ""
                                : ""

                    }

                }

            };

        }
    );

};


// ==========================================
// MONTHLY ATTENDANCE MATRIX
// ==========================================
//
// Final structure:
//
// employee
//    ├── Day
//    │     ├── 1
//    │     ├── 2
//    │     └── ...
//    │
//    └── Night
//          ├── 1
//          ├── 2
//          └── ...
//
// Missing records => Not Assigned
//
// No duplicate employee information is
// generated here. The frontend will render
// the employee details once and create two
// linked rows for Day/Night.
//

const getMonthlyAttendanceMatrix =
    async (
        year,
        month
    ) => {

        const numericYear =
            Number(year);

        const numericMonth =
            Number(month);


        const start =
            new Date(
                numericYear,
                numericMonth - 1,
                1
            );


        const end =
            new Date(
                numericYear,
                numericMonth,
                1
            );


        const daysInMonth =
            getDaysInMonth(
                numericYear,
                numericMonth
            );


        // ==================================
        // ACTIVE EMPLOYEES
        // ==================================

        const employees =
            await Employee
                .find({

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


        // ==================================
        // MONTH ATTENDANCE
        // ==================================

        const attendance =
            await Attendance.find({

                date: {

                    $gte:
                        start,

                    $lt:
                        end

                }

            });


        // ==================================
        // EMPLOYEE → SHIFT → DAY
        // ==================================

        const attendanceMap =
            new Map();


        attendance.forEach(
            record => {

                const employeeKey =
                    record.employee
                        .toString();


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


                const employeeMap =
                    attendanceMap.get(
                        employeeKey
                    );


                if (
                    !employeeMap.has(
                        shift
                    )
                ) {

                    employeeMap.set(
                        shift,
                        new Map()
                    );

                }


                const recordDate =
                    new Date(
                        record.date
                    );


                const day =
                    recordDate.getDate();


                employeeMap
                    .get(shift)
                    .set(
                        day,
                        {

                            status:
                                normalizeStatus(
                                    record.status
                                ),

                            remarks:
                                record.remarks ||
                                "",

                            attendanceId:
                                record._id

                        }
                    );

            }
        );


        // ==================================
        // BUILD EMPLOYEE DATA
        // ==================================

        return employees.map(
            employee => {

                const employeeKey =
                    employee._id.toString();


                const employeeAttendance =
                    attendanceMap.get(
                        employeeKey
                    ) || new Map();


                const shifts = {};


                for (
                    const shift of [
                        "Day",
                        "Night"
                    ]
                ) {

                    const shiftMap =
                        employeeAttendance.get(
                            shift
                        ) || new Map();


                    const days = {};


                    for (
                        let day = 1;
                        day <= daysInMonth;
                        day++
                    ) {

                        const record =
                            shiftMap.get(
                                day
                            );


                        days[day] = {

                            status:
                                record
                                    ? record.status
                                    : "Not Assigned",

                            remarks:
                                record
                                    ? record.remarks
                                    : "",

                            attendanceId:
                                record
                                    ? record.attendanceId
                                    : null

                        };

                    }


                    shifts[shift] = days;

                }


                // ==================================
                // TOTALS
                // ==================================

                const totals = {

                    present: 0,

                    absent: 0,

                    halfDay: 0,

                    holiday: 0

                };


                for (
                    const shift of [
                        "Day",
                        "Night"
                    ]
                ) {

                    Object.values(
                        shifts[shift]
                    )
                    .forEach(
                        record => {

                            switch (
                                record.status
                            ) {

                                case "Present":

                                    totals.present++;

                                    break;


                                case "Absent":

                                    totals.absent++;

                                    break;


                                case "Half Day":

                                    totals.halfDay++;

                                    break;


                                case "Holiday":

                                    totals.holiday++;

                                    break;

                            }

                        }
                    );

                }


                return {

                    employeeId:
                        employee.employeeId,

                    fullName:
                        employee.fullName,

                    department:
                        employee.department,

                    designation:
                        employee.designation,

                    shifts,

                    totals

                };

            }
        );

    };


// ==========================================
// EXPORTS
// ==========================================

module.exports = {

    getDailyReport,

    getMonthlyReport,

    getEmployeeHistory,

    getDepartmentReport,

    getMonthlyAttendanceMatrix

};