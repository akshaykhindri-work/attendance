const express = require("express");

const router = express.Router();

const authMiddleware = require("../auth/auth.middleware");

const {
    departmentValidator
} = require("./department.validator");

const {
    createDepartment,
    getDepartments,
    getDepartment,
    updateDepartment,
    deleteDepartment
} = require("./department.controller");

router.use(authMiddleware);

router.post("/", departmentValidator, createDepartment);

router.get("/", getDepartments);

router.get("/:id", getDepartment);

router.put("/:id", departmentValidator, updateDepartment);

router.delete("/:id", deleteDepartment);

module.exports = router;