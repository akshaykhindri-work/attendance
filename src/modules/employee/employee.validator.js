const { body, validationResult } = require("express-validator");

const employeeValidator = [

    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required.")
        .isLength({ max: 100 })
        .withMessage("Full name cannot exceed 100 characters."),

    body("fatherName")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Father name cannot exceed 100 characters."),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required.")
        .matches(/^[0-9]{10}$/)
        .withMessage("Phone number must be exactly 10 digits."),

    body("department")
        .notEmpty()
        .withMessage("Department is required.")
        .isMongoId()
        .withMessage("Invalid department ID."),

    body("designation")
        .notEmpty()
        .withMessage("Designation is required.")
        .isMongoId()
        .withMessage("Invalid designation ID."),

    body("joiningDate")
        .notEmpty()
        .withMessage("Joining date is required.")
        .isISO8601()
        .withMessage("Invalid joining date."),

    body("salary")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Salary must be a positive number."),

    body("notes")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Notes cannot exceed 500 characters."),

    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: errors.array()
            });
        }

        next();

    }

];

module.exports = {
    employeeValidator
};