const Employee = require("../employee/employee.model");
const Department = require("./department.model");

// Create
const createDepartment = async (data) => {

    const exists = await Department.findOne({
        name: new RegExp(`^${data.name.trim()}$`, "i"),
        isActive: true
    });

    if (exists) {
        throw new Error("Department already exists.");
    }

    return await Department.create(data);

};

// Get All
const getDepartments = async () => {

    return await Department.find({
        isActive: true
    }).sort({
        name: 1
    });

};

// Get One
const getDepartmentById = async (id) => {

    return await Department.findOne({
        _id: id,
        isActive: true
    });

};

// Update
const updateDepartment = async (id, data) => {

    if (data.name) {

        const exists = await Department.findOne({
            _id: { $ne: id },
            name: new RegExp(`^${data.name.trim()}$`, "i"),
            isActive: true
        });

        if (exists) {
            throw new Error("Department already exists.");
        }

    }

    return await Department.findOneAndUpdate(
        {
            _id: id,
            isActive: true
        },
        data,
        {
            new: true,
            runValidators: true
        }
    );

};

// Soft Delete
const deleteDepartment = async (id) => {

    const employeeExists = await Employee.exists({
        department: id,
        isActive: true
    });

    if (employeeExists) {
        throw new Error(
            "Cannot delete department because active employees are assigned to it."
        );
    }

    return await Department.findOneAndUpdate(
        {
            _id: id,
            isActive: true
        },
        {
            isActive: false
        },
        {
            new: true
        }
    );

};

module.exports = {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
};