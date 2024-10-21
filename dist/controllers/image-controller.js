"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
console.log("Cloudinary configured for cloud_name:", process.env.CLOUD_NAME);
// Correctly define the storage configuration, allowing folder and other parameters
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (req, file) => {
        return {
            folder: "uploads", // Specify the folder where images will be uploaded in Cloudinary
            format: "png", // Optional: specify format (or use 'auto' for auto-detection)
            public_id: file.originalname.split(".")[0], // Use the original file name (without extension)
        };
    },
});
const upload = (0, multer_1.default)({ storage });
exports.upload = upload;
const uploadImage = async (req, res) => {
    try {
        // Cloudinary automatically stores file URLs in `path`
        const imageUrls = req.files.map((file) => file.path);
        res.status(200).json({ success: true, imageUrls });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.uploadImage = uploadImage;
