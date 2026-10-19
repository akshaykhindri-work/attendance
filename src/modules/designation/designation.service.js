const Designation = require("./designation.model");
const Employee = require("../employee/employee.model");

// Create
const createDesignation = async (data) => {

    const exists = await Designation.findOne({
        name: new RegExp(`^${data.name.trim()}$`, "i"),
        isActive: true
    });

    if (exists) {
        throw new Error("Designation already exists.");
    }

    return await Designation.create(data);

};

// Get All
const getDesignations = async () => {

    return await Designation.find({
        isActive: true
    }).sort({
        name: 1
    });

};

// Get One
const getDesignationById = async (id) => {

    return await Designation.findOne({
        _id: id,
        isActive: true
    });

};

// Update
const updateDesignation = async (id, data) => {

    if (data.name) {

        const exists = await Designation.findOne({
            _id: { $ne: id },
            name: new RegExp(`^${data.name.trim()}$`, "i"),
            isActive: true
        });

        if (exists) {
            throw new Error("Designation already exists.");
        }

    }

    return await Designation.findOneAndUpdate(
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
const deleteDesignation = async (id) => {

    const employeeExists = await Employee.exists({
        designation: id,
        isActive: true
    });

    if (employeeExists) {
        throw new Error(
            "Cannot delete designation because active employees are assigned to it."
        );
    }

    return await Designation.findOneAndUpdate(
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
    createDesignation,
    getDesignations,
    getDesignationById,
    updateDesignation,
    deleteDesignation
};