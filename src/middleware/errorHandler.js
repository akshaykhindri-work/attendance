const { errorResponse } = require("../utils/apiResponse");

const errorHandler = (err, req, res, next) => {

    console.error(err);

    // Duplicate Key Error
    if (err.code === 11000) {
        return errorResponse(
            res,
            409,
            "Duplicate record already exists."
        );
    }

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        return errorResponse(
            res,
            400,
            "Invalid ID."
        );
    }

    // Mongoose Validation Error
    if (err.name === "ValidationError") {

        const errors = Object.values(err.errors).map(error => ({
            field: error.path,
            message: error.message
        }));

        return errorResponse(
            res,
            400,
            "Validation failed.",
            errors
        );

    }

    return errorResponse(
        res,
        err.statusCode || 500,
        err.message || "Internal Server Error"
    );

};

module.exports = errorHandler;