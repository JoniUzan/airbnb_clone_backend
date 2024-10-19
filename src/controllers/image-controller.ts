import { Request, Response } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinaryV2 } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinaryV2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

console.log("Cloudinary configured for cloud_name:", process.env.CLOUD_NAME);

// Correctly define the storage configuration, allowing folder and other parameters
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,
  params: async (req, file) => {
    return {
      folder: "uploads", // Specify the folder where images will be uploaded in Cloudinary
      format: "png", // Optional: specify format (or use 'auto' for auto-detection)
      public_id: file.originalname.split(".")[0], // Use the original file name (without extension)
    };
  },
});

const upload = multer({ storage });

// Custom MulterRequest interface to handle multiple file uploads
export interface MulterRequest extends Request {
  files: Express.Multer.File[]; // Handle multiple files
}

const uploadImage = async (
  req: MulterRequest,
  res: Response
): Promise<void> => {
  try {
    // Cloudinary automatically stores file URLs in `path`
    const imageUrls = req.files.map((file: any) => file.path);

    res.status(200).json({ success: true, imageUrls });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// Export the middleware and handler
export { upload, uploadImage };
