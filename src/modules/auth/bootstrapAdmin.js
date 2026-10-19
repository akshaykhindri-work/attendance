const bcrypt = require("bcrypt");
const User = require("./user.model");

const bootstrapAdmin = async () => {

    try {

        const admin = await User.findOne({
            username: process.env.ADMIN_USERNAME.toLowerCase()
        });

        if (admin) {
            console.log("✅ Admin user already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            12
        );

        await User.create({
            username: process.env.ADMIN_USERNAME.toLowerCase(),
            password: hashedPassword
        });

        console.log("✅ Default admin created.");

    } catch (error) {

        console.error("❌ Bootstrap failed.");
        console.error(error);

    }

};

module.exports = bootstrapAdmin;