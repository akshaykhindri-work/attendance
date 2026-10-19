const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        fullName: {
            type: String,
            required: true,
            trim: true
        },

        fatherName: {
            type: String,
            trim: true,
            default: ""
        },

        phone: {
            type: String,
            required: true,
            trim: true,
            match: [/^[0-9]{10}$/, "Phone number must be exactly 10 digits."]
        },

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true
        },

        designation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Designation",
            required: true
        },

        joiningDate: {
            type: Date,
            required: true
        },

        salary: {
            type: Number,
            default: 0,
            min: 0
        },

        notes: {
            type: String,
            trim: true,
            default: ""
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Employee", employeeSchema);