const { body, validationResult } = require("express-validator");

const departmentValidator = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Department name is required.")
        .isLength({ max: 100 })
        .withMessage("Department name cannot exceed 100 characters."),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 250 })
        .withMessage("Description cannot exceed 250 characters."),

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
    departmentValidator
};