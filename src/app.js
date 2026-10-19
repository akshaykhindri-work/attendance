const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");

const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Trust Proxy (Required for secure cookies in production)
app.set("trust proxy", 1);

// Security
app.use(helmet());

// CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);

// Performance & Logging
app.use(compression());
app.use(morgan("dev"));

// Body Parsers
app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

// Session
app.use(
    session({
        name: "attendancehub.sid",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: "sessions",
            ttl: 60 * 60 * 8 // 8 Hours
        }),

        cookie: {
            maxAge: 1000 * 60 * 60 * 8, // 8 Hours
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        }
    })
);
// Health Check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "AttendanceHub API Running 🚀"
    });
});

// ADD THIS HERE
app.get("/session-test", (req, res) => {
    res.json({
        sessionID: req.sessionID,
        session: req.session,
        user: req.session.user || null
    });
});

// API Routes
app.use("/api", routes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;