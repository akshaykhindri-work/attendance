const express = require("express");

const router = express.Router();

const controller = require("./auth.controller");

const {
    loginValidator
} = require("./auth.validator");

const loginLimiter = require("./loginLimiter");
const authMiddleware = require("./auth.middleware");


router.get(
    "/me",
    authMiddleware,
    controller.me
);

router.post(
    "/login",
    loginLimiter,
    loginValidator,
    controller.login
);

router.post(
    "/logout",
    authMiddleware,
    controller.logout
);

module.exports = router;