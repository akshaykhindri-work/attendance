const dashboardService = require("./dashboard.service");

const {
    successResponse,
    errorResponse
} = require("../../utils/apiResponse");

exports.getDashboard = async (req, res) => {

    try {

        const data = await dashboardService.getDashboard();

        return successResponse(
            res,
            200,
            "Dashboard loaded successfully.",
            data
        );

    } catch (error) {

        return errorResponse(
            res,
            500,
            error.message
        );

    }

};