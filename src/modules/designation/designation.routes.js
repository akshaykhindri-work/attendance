const express = require("express");

const router = express.Router();

const authMiddleware = require("../auth/auth.middleware");

const {
    designationValidator
} = require("./designation.validator");

const {
    createDesignation,
    getDesignations,
    getDesignation,
    updateDesignation,
    deleteDesignation
} = require("./designation.controller");

router.use(authMiddleware);

router.post("/", designationValidator, createDesignation);

router.get("/", getDesignations);

router.get("/:id", getDesignation);

router.put("/:id", designationValidator, updateDesignation);

router.delete("/:id", deleteDesignation);

module.exports = router;