const {
    body,
    validationResult
} = require("express-validator");


const attendanceValidator = [

    // ======================================
    // EMPLOYEE ID
    // ======================================

    body("employeeId")

        .trim()

        .notEmpty()

        .withMessage(
            "Employee ID is required."
        )

        .matches(
            /^EMP\d{3}$/
        )

        .withMessage(
            "Employee ID must be in format EMP001."
        ),


    // ======================================
    // DATE
    // ======================================

    body("date")

        .notEmpty()

        .withMessage(
            "Date is required."
        )

        .isISO8601()

        .withMessage(
            "Date must be in YYYY-MM-DD format."
        ),


    // ======================================
    // SHIFT
    // ======================================

    body("shift")

        .notEmpty()

        .withMessage(
            "Shift is required."
        )

        .isIn([
            "Day",
            "Night"
        ])

        .withMessage(
            "Shift must be Day or Night."
        ),


    // ======================================
    // STATUS
    // ======================================

    body("status")

        .notEmpty()

        .withMessage(
            "Attendance status is required."
        )

        .isIn([
            "Present",
            "Half Day",
            "Absent",
            "Holiday",
            "Not Assigned"
        ])

        .withMessage(
            "Invalid attendance status."
        ),


    // ======================================
    // REMARKS
    // ======================================

    body("remarks")

        .optional()

        .trim()

        .isLength({
            max: 250
        })

        .withMessage(
            "Remarks cannot exceed 250 characters."
        ),


    // ======================================
    // VALIDATION RESULT
    // ======================================

    (req, res, next) => {

        const errors =
            validationResult(req);


        if (!errors.isEmpty()) {

            return res.status(400).json({

                success: false,

                message:
                    "Validation failed.",

                errors:
                    errors.array()

            });

        }


        next();

    }

];


module.exports = {
    attendanceValidator
};