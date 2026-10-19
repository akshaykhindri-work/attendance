const Employee = require("./employee.model");

// Generate Employee ID
// ==========================================
// Generate Unique Employee ID
// Format: EMP001, EMP002, EMP003...
// ==========================================

const generateEmployeeId = async () => {

    const employees =
        await Employee.find({
            employeeId: {
                $regex: /^EMP\d+$/
            }
        })
        .select("employeeId")
        .lean();


    let maxNumber = 0;


    employees.forEach(employee => {

        const match =
            employee.employeeId.match(
                /^EMP(\d+)$/
            );


        if (!match) {
            return;
        }


        const number =
            parseInt(
                match[1],
                10
            );


        if (
            Number.isInteger(number) &&
            number > maxNumber
        ) {

            maxNumber = number;

        }

    });


    let nextNumber =
        maxNumber + 1;


    /*
     * Extra safety:
     * verify that the calculated ID
     * does not already exist.
     */

    while (
        await Employee.exists({
            employeeId:
                `EMP${String(nextNumber).padStart(3, "0")}`
        })
    ) {

        nextNumber++;

    }


    return (
        `EMP${String(
            nextNumber
        ).padStart(3, "0")}`
    );

};


// Create Employee
const createEmployee = async (data) => {

    const employeeId =
        await generateEmployeeId();


    const employee =
        await Employee.create({

            employeeId,

            fullName:
                data.fullName,

            fatherName:
                data.fatherName || "",

            phone:
                data.phone,

            department:
                data.department,

            designation:
                data.designation,

            joiningDate:
                data.joiningDate,

            salary:
                data.salary || 0,

            notes:
                data.notes || "",

            isActive:
                true

        });


    return employee;

};

// Get All Employees
const getEmployees = async () => {

    return await Employee.find({
        isActive: true
    })
        .populate("department", "name")
        .populate("designation", "name")
        .sort({
            employeeId: 1
        });

};

// Get One Employee
const getEmployeeById = async (id) => {

    return await Employee.findOne({
        _id: id,
        isActive: true
    })
        .populate("department", "name")
        .populate("designation", "name");

};

// Update Employee
const updateEmployee = async (id, data) => {

    return await Employee.findOneAndUpdate(
        {
            _id: id,
            isActive: true
        },
        data,
        {
            new: true,
            runValidators: true
        }
    )
        .populate("department", "name")
        .populate("designation", "name");

};

// Soft Delete Employee
const deleteEmployee = async (id) => {

    return await Employee.findOneAndUpdate(
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
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};