"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRoutes = void 0;
const express_1 = require("express");
const image_controller_1 = require("../controllers/image-controller");
// Create an instance of Router
exports.uploadRoutes = (0, express_1.Router)();
// Define the route for handling multiple file uploads
exports.uploadRoutes.post("/upload", image_controller_1.upload.array('images'), // Assert the type here
(req, res) => (0, image_controller_1.uploadImage)(req, res) // Cast request to MulterRequest
);
