exports.successResponse = (
    res,
    statusCode = 200,
    message = "Success",
    data = null,
    meta = null
) => {

    const response = {
        success: true,
        message,
        data
    };

    if (meta) {
        response.meta = meta;
    }

    return res.status(statusCode).json(response);

};

exports.errorResponse = (
    res,
    statusCode = 500,
    message = "Something went wrong",
    errors = null
) => {

    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);

};