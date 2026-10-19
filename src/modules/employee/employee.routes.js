const express = require("express");

const router = express.Router();

const authMiddleware = require("../auth/auth.middleware");

const {
    employeeValidator
} = require("./employee.validator");

const {
    createEmployee,
    getEmployees,
    getEmployee,
    updateEmployee,
    deleteEmployee
} = require("./employee.controller");

// Protect all routes
router.use(authMiddleware);

// Create
router.post(
    "/",
    employeeValidator,
    createEmployee
);

// Get All
router.get(
    "/",
    getEmployees
);

// Get One
router.get(
    "/:id",
    getEmployee
);

// Update
router.put(
    "/:id",
    employeeValidator,
    updateEmployee
);

// Delete
router.delete(
    "/:id",
    deleteEmployee
);

module.exports = router;