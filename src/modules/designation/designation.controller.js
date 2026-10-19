const designationService = require("./designation.service");

const {
    successResponse,
    errorResponse
} = require("../../utils/apiResponse");

exports.createDesignation = async (req, res) => {

    try {

        const designation = await designationService.createDesignation(req.body);

        return successResponse(
            res,
            201,
            "Designation created successfully.",
            designation
        );

    } catch (error) {

        return errorResponse(
            res,
            400,
            error.message
        );

    }

};

exports.getDesignations = async (req, res) => {

    try {

        const designations = await designationService.getDesignations();

        return successResponse(
            res,
            200,
            "Designations fetched successfully.",
            designations
        );

    } catch (error) {

        return errorResponse(
            res,
            500,
            error.message
        );

    }

};

exports.getDesignation = async (req, res) => {

    try {

        const designation = await designationService.getDesignationById(req.params.id);

        if (!designation) {
            return errorResponse(
                res,
                404,
                "Designation not found."
            );
        }

        return successResponse(
            res,
            200,
            "Designation fetched successfully.",
            designation
        );

    } catch (error) {

        return errorResponse(
            res,
            400,
            error.message
        );

    }

};

exports.updateDesignation = async (req, res) => {

    try {

        const designation = await designationService.updateDesignation(
            req.params.id,
            req.body
        );

        if (!designation) {
            return errorResponse(
                res,
                404,
                "Designation not found."
            );
        }

        return successResponse(
            res,
            200,
            "Designation updated successfully.",
            designation
        );

    } catch (error) {

        return errorResponse(
            res,
            400,
            error.message
        );

    }

};

exports.deleteDesignation = async (req, res) => {

    try {

        const designation = await designationService.deleteDesignation(req.params.id);

        if (!designation) {
            return errorResponse(
                res,
                404,
                "Designation not found."
            );
        }

        return successResponse(
            res,
            200,
            "Designation deleted successfully."
        );

    } catch (error) {

        return errorResponse(
            res,
            400,
            error.message
        );

    }

};