const { errorResponse } = require("../../utils/apiResponse");

module.exports = (req, res, next) => {

    if (!req.session || !req.session.user) {

        return errorResponse(
            res,
            401,
            "Unauthorized. Please login."
        );

    }

    next();

};