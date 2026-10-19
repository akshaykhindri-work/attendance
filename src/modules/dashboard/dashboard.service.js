const Employee = require("../employee/employee.model");
const Department = require("../department/department.model");
const Attendance = require("../attendance/attendance.model");


// ==========================================
// DASHBOARD SERVICE
// ==========================================

const getDashboard = async () => {

    // ======================================
    // TODAY
    // ======================================

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const tomorrow = new Date(
        today
    );

    tomorrow.setDate(
        tomorrow.getDate() + 1
    );


    // ======================================
    // BASIC COUNTS
    // ======================================

    const [
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        totalDepartments,
        todayAttendance
    ] = await Promise.all([

        // All employees
        Employee.countDocuments(),

        // Active employees
        Employee.countDocuments({
            isActive: true
        }),

        // Inactive employees
        Employee.countDocuments({
            isActive: false
        }),

        // Active departments
        Department.countDocuments({
            isActive: true
        }),

        // Today's attendance
        Attendance.find({
            date: {
                $gte: today,
                $lt: tomorrow
            }
        })

    ]);


    // ======================================
    // EMPTY SHIFT STATS
    // ======================================

    const createShiftStats = () => ({
        present: 0,
        absent: 0,
        halfDay: 0,
        holiday: 0,
        notAssigned: 0
    });


    const day = createShiftStats();

    const night = createShiftStats();

    const total = createShiftStats();


    // ======================================
    // COUNT ATTENDANCE
    // ======================================

    todayAttendance.forEach(
        record => {

            const shift =
                record.shift === "Night"
                    ? "Night"
                    : "Day";


            let stats;

            if (shift === "Night") {
                stats = night;
            } else {
                stats = day;
            }


            switch (record.status) {

                case "Present":

                    stats.present++;

                    break;


                case "Absent":

                    stats.absent++;

                    break;


                case "Half Day":

                    stats.halfDay++;

                    break;


                case "Holiday":

                    stats.holiday++;

                    break;


                case "Not Assigned":

                    stats.notAssigned++;

                    break;

            }

        }
    );


    // ======================================
    // CALCULATE NOT ASSIGNED
    // ======================================
    //
    // Not Assigned is normally NOT stored
    // in MongoDB.
    //
    // If an active employee has no attendance
    // record for a particular shift, that shift
    // is considered Not Assigned.
    //
    // Active employees:
    //     40
    //
    // Day records:
    //     21
    //
    // Day Not Assigned:
    //     40 - 21 = 19
    //
    // ======================================

    const dayRecords =
        todayAttendance.filter(
            record =>
                record.shift !== "Night"
        ).length;


    const nightRecords =
        todayAttendance.filter(
            record =>
                record.shift === "Night"
        ).length;


    day.notAssigned =
        Math.max(
            0,
            activeEmployees - dayRecords
        );


    night.notAssigned =
        Math.max(
            0,
            activeEmployees - nightRecords
        );


    // ======================================
    // TOTALS
    // ======================================

    total.present =
        day.present +
        night.present;


    total.absent =
        day.absent +
        night.absent;


    total.halfDay =
        day.halfDay +
        night.halfDay;


    total.holiday =
        day.holiday +
        night.holiday;


    total.notAssigned =
        day.notAssigned +
        night.notAssigned;


    // ======================================
    // RETURN DASHBOARD DATA
    // ======================================

    return {

        totalEmployees,

        activeEmployees,

        inactiveEmployees,

        totalDepartments,

        today: {

            day,

            night,

            total

        }

    };

};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    getDashboard
};