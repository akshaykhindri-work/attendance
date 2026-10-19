const authService = require("./auth.service");

const {
    successResponse,
    errorResponse
} = require("../../utils/apiResponse");

exports.login = async (req, res) => {

    try {

        const { username, password } = req.body;

        const user = await authService.login(
            username,
            password
        );

        req.session.user = {
            id: user._id.toString(),
            username: user.username
        };

        req.session.save((err) => {

            if (err) {

                return errorResponse(
                    res,
                    500,
                    "Failed to create session."
                );

            }

            return successResponse(
                res,
                200,
                "Login successful.",
                {
                    username: user.username,
                    lastLogin: user.lastLogin
                }
            );

        });

    } catch (error) {

        return errorResponse(
            res,
            401,
            error.message
        );

    }

};

exports.logout = (req, res) => {

    req.session.destroy((err) => {

        if (err) {

            return errorResponse(
                res,
                500,
                "Logout failed."
            );

        }

        res.clearCookie("attendancehub.sid");

        return successResponse(
            res,
            200,
            "Logged out successfully."
        );

    });

};

exports.me = async (req, res) => {

    try {

        if (!req.session.user) {

            return errorResponse(
                res,
                401,
                "Unauthorized"
            );

        }

        const user = await authService.getCurrentUser(
            req.session.user.id
        );

        return successResponse(
            res,
            200,
            "Current user fetched successfully.",
            user
        );

    } catch (error) {

        return errorResponse(
            res,
            401,
            "Unauthorized"
        );

    }

};