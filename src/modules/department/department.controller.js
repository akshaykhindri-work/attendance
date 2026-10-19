const departmentService = require("./department.service");

const {
    successResponse,
    errorResponse
} = require("../../utils/apiResponse");

exports.createDepartment = async (req, res) => {

    try {

        const department = await departmentService.createDepartment(req.body);

        return successResponse(
            res,
            201,
            "Department created successfully.",
            department
        );

    } catch (error) {

        return errorResponse(
            res,
            400,
            error.message
        );

    }

};

exports.getDepartments = async (req, res) => {

    try {

        const departments = await departmentService.getDepartments();

        return successResponse(
            res,
            200,
            "Departments fetched successfully.",
            departments
        );

    } catch (error) {

        return errorResponse(
            res,
            500,
            error.message
        );

    }

};

exports.getDepartment = async (req, res) => {

    try {

        const department = await departmentService.getDepartmentById(req.params.id);

        if (!department) {
            return errorResponse(
                res,
                404,
                "Department not found."
            );
        }

        return successResponse(
            res,
            200,
            "Department fetched successfully.",
            department
        );

    } catch (error) {

        return errorResponse(
            res,
            400,
            error.message
        );

    }

};

exports.updateDepartment = async (req, res) => {

    try {

        const department = await departmentService.updateDepartment(
            req.params.id,
            req.body
        );

        if (!department) {
            return errorResponse(
                res,
                404,
                "Department not found."
            );
        }

        return successResponse(
            res,
            200,
            "Department updated successfully.",
            department
        );

    } catch (error) {

        return errorResponse(
            res,
            400,
            error.message
        );

    }

};

exports.deleteDepartment = async (req, res) => {

    try {

        const department = await departmentService.deleteDepartment(req.params.id);

        if (!department) {
            return errorResponse(
                res,
                404,
                "Department not found."
            );
        }

        return successResponse(
            res,
            200,
            "Department deleted successfully."
        );

    } catch (error) {

        return errorResponse(
            res,
            400,
            error.message
        );

    }

};