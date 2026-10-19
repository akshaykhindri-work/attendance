const employeeService = require("./employee.service");

const {
    successResponse,
    errorResponse
} = require("../../utils/apiResponse");

// Create Employee
exports.createEmployee = async (req, res) => {

    try {

        const employee = await employeeService.createEmployee(req.body);

        return successResponse(
            res,
            201,
            "Employee created successfully.",
            employee
        );

    } catch (error) {

        return errorResponse(
            res,
            400,
            error.message
        );

    }

};

// Get All Employees
exports.getEmployees = async (req, res) => {

    try {

        const employees = await employeeService.getEmployees();

        return successResponse(
            res,
            200,
            "Employees fetched successfully.",
            employees
        );

    } catch (error) {

        return errorResponse(
            res,
            500,
            error.message
        );

    }

};

// Get One Employee
exports.getEmployee = async (req, res) => {

    try {

        const employee = await employeeService.getEmployeeById(req.params.id);

        if (!employee) {
            return errorResponse(
                res,
                404,
                "Employee not found."
            );
        }

        return successResponse(
            res,
            200,
            "Employee fetched successfully.",
            employee
        );

    } catch (error) {

        return errorResponse(
            res,
            400,
            error.message
        );

    }

};

// Update Employee
exports.updateEmployee = async (req, res) => {

    try {

        const employee = await employeeService.updateEmployee(
            req.params.id,
            req.body
        );

        if (!employee) {
            return errorResponse(
                res,
                404,
                "Employee not found."
            );
        }

        return successResponse(
            res,
            200,
            "Employee updated successfully.",
            employee
        );

    } catch (error) {

        return errorResponse(
            res,
            400,
            error.message
        );

    }

};

// Soft Delete Employee
exports.deleteEmployee = async (req, res) => {

    try {

        const employee = await employeeService.deleteEmployee(req.params.id);

        if (!employee) {
            return errorResponse(
                res,
                404,
                "Employee not found."
            );
        }

        return successResponse(
            res,
            200,
            "Employee deleted successfully."
        );

    } catch (error) {

        return errorResponse(
            res,
            400,
            error.message
        );

    }

};