"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const auth_routes_1 = require("./routes/auth-routes");
const homes_routes_1 = require("./routes/homes-routes");
const reservation_routes_1 = require("./routes/reservation-routes");
const user_routes_1 = require("./routes/user-routes");
const image_route_1 = require("./routes/image-route");
const notification_routes_1 = __importDefault(require("./routes/notification-routes"));
// import socketMiddleware from "./middelware/auth-req";
const socket_1 = require("./socket"); // Import the Socket.IO setup
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // Adjust this for production to the correct origin
        methods: ["GET", "POST", "PATCH", "DELETE"],
    },
});
(0, socket_1.setupSocketIO)(exports.io); // Set up Socket.IO
async function main() {
    // Connect to database
    await (0, db_1.connectDB)();
    // Middleware
    app.use(express_1.default.json());
    app.use((0, cors_1.default)({
        origin: "*", // Adjust this for production to the correct origin
        methods: ["GET", "POST", "PATCH", "DELETE"],
    })); // Configure CORS properly for production
    // Routes
    app.use("/api/auth", auth_routes_1.authRoutes);
    app.use("/api/homes", homes_routes_1.homeRoutes);
    app.use("/api/reservation", reservation_routes_1.reservationRoutes);
    app.use("/api/user", user_routes_1.userRoutes);
    app.use("/api/images", image_route_1.uploadRoutes);
    // app.use("/api/chat", chatRouter);
    app.use("/api/notification", notification_routes_1.default);
    app.get("/", (req, res) => res.json("Express on Vercel"));
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
main();
