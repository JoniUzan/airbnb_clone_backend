"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.logIn = logIn;
exports.getUserById = getUserById;
exports.getAllUsers = getAllUsers;
const user_model_1 = __importDefault(require("../models/user-model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10; // Number of rounds to generate salt. 10 is recommended value
async function register(req, res) {
    try {
        const { username, password, email, firstName, lastName } = req.body;
        const hashedPassword = await bcryptjs_1.default.hash(password, SALT_ROUNDS); // Hash password
        const user = new user_model_1.default({
            username,
            password: hashedPassword,
            email,
            firstName,
            lastName,
        });
        await user.save(); // Save user to database
        res.status(201).json({ user });
    }
    catch (error) {
        console.error("Error during user registration:", error);
        if (error.code === 11000) {
            return res.status(400).json({ error: "User already exists" });
        }
        res
            .status(500)
            .json({ error: "Registration failed", details: error.message });
    }
}
async function logIn(req, res) {
    try {
        const { email, password } = req.body;
        // Log input details
        const user = await user_model_1.default.findOne({ email });
        ("User found");
        if (!user) {
            return res.status(401).json({ error: "Authentication failed" });
        }
        const isPasswordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            ("password match failed");
            return res.status(401).json({ error: "Authentication failed" });
        }
        // Generate JWT token containing user id
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "24h",
        });
        // Send token in response to the client, not the user object!
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
}
async function getUserById(req, res) {
    const { userId } = req;
    userId;
    try {
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const userObject = user.toObject();
        const { password, ...userWithoutPassword } = userObject;
        res.status(200).json({ user: userWithoutPassword });
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Server error" });
    }
}
async function getAllUsers(req, res) {
    try {
        const users = await user_model_1.default.find();
        const usersWithoutPassword = users.map((user) => {
            const userObject = user.toObject();
            const { password, ...userWithoutPassword } = userObject;
            return userWithoutPassword;
        });
        res.status(200).json({ users: usersWithoutPassword });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Server error" });
    }
}
