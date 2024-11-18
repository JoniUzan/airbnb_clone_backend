"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthday: { type: Date },
    picture: { type: String },
    phoneNumber: { type: String },
    wishlists: { type: [Object], default: [] },
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
