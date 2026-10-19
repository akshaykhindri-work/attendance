const bcrypt = require("bcrypt");
const User = require("./user.model");

const login = async (username, password) => {

    const user = await User.findOne({
        username: username.trim().toLowerCase(),
        isActive: true
    }).select("+password");

    if (!user) {
        throw new Error("Invalid username or password.");
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new Error("Invalid username or password.");
    }

    user.lastLogin = new Date();
    await user.save();

    return user;

};

const getCurrentUser = async (id) => {
    const user = await User.findById(id)
        .select("username role");

    if (!user || !user.isActive) {
        throw new Error("Unauthorized");
    }

    return user;
};

module.exports = {
    login,
    getCurrentUser
};