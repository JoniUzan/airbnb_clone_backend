"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { JWT_SECRET } = process.env;
function verifyToken(req, res, next) {
    // Split the token from the header (Bearer token)
    const authHeader = req.headers["Authorization"] || req.headers["authorization"]; // Get the authorization header
    let token;
    if (typeof authHeader === "string") {
        token = authHeader && authHeader.split(" ")[1]; // Get the token from the header
    }
    if (!token) {
        console.log("auth.middleware, verifyToken. No token provided");
        return res.status(401).json({ error: "Access denied" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // Add userId to request object
        next(); // Call next middleware
    }
    catch (error) {
        console.log("auth.middleware, verifyToken. Error while verifying token", error);
        res.status(401).json({ error: "Invalid token" });
    }
}
