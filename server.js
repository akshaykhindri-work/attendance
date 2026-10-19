require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const bootstrapAdmin = require("./src/modules/auth/bootstrapAdmin");

const PORT = process.env.PORT || 5000;

const startServer = async () => {

    try {

        await connectDB();
        console.log("✅ MongoDB Connected");

        await bootstrapAdmin();
        console.log("✅ Admin Bootstrap Completed");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {

        console.error("❌ Server startup failed");
        console.error(error);

        process.exit(1);

    }

};

startServer();