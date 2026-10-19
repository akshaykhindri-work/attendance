const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true
        },


        date: {
            type: Date,
            required: true
        },


        // ======================================
        // SHIFT
        // ======================================

        shift: {
            type: String,

            enum: [
                "Day",
                "Night"
            ],

            /*
             * New attendance records default
             * to Day.
             *
             * Existing database records created
             * before the shift system may not have
             * this field. The service layer handles
             * those legacy records as Day.
             */

            default: "Day",

            required: true
        },


        // ======================================
        // STATUS
        // ======================================

        status: {
            type: String,

            /*
             * These are the new official statuses.
             *
             * "Double Shift" is retained temporarily
             * only so old historical records remain
             * readable after the schema change.
             */

            enum: [
                "Present",
                "Half Day",
                "Absent",
                "Holiday",
                "Not Assigned",
                "Double Shift"
            ],

            default: "Not Assigned"
        },


        // ======================================
        // REMARKS
        // ======================================

        remarks: {
            type: String,

            trim: true,

            maxlength: 250,

            default: ""
        }
    },

    {
        timestamps: true
    }
);


// ==========================================
// PREVENT DUPLICATE SHIFT ATTENDANCE
// ==========================================
//
// One employee can now have:
//
// EMP001 + 2026-08-12 + Day
// EMP001 + 2026-08-12 + Night
//
// But cannot have:
//
// EMP001 + 2026-08-12 + Day
// EMP001 + 2026-08-12 + Day
//

attendanceSchema.index(
    {
        employee: 1,
        date: 1,
        shift: 1
    },
    {
        unique: true
    }
);


// ==========================================
// DATE INDEX
// ==========================================

attendanceSchema.index({
    date: 1
});


// ==========================================
// EMPLOYEE + DATE INDEX
// ==========================================
//
// Helpful for day/night sheet loading.
//

attendanceSchema.index({
    employee: 1,
    date: 1
});


module.exports =
    mongoose.model(
        "Attendance",
        attendanceSchema
    );