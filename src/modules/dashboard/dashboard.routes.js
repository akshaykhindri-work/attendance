const express = require("express");

const router = express.Router();

const authMiddleware = require("../auth/auth.middleware");

const {
    getDashboard
} = require("./dashboard.controller");

router.use(authMiddleware);

router.get("/", getDashboard);

module.exports = router;

