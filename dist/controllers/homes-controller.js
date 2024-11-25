"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHomesForHomePage = getHomesForHomePage;
exports.getAllHomesByFilter = getAllHomesByFilter;
exports.getHomeById = getHomeById;
exports.getAllHomesCountByFilter = getAllHomesCountByFilter;
exports.CreateNewHome = CreateNewHome;
exports.updateHome = updateHome;
exports.getHomesByHost = getHomesByHost;
exports.deleteHomeById = deleteHomeById;
const home_model_1 = __importDefault(require("../models/home-model"));
const criteria_1 = __importDefault(require("../utils/criteria"));
//////////////////////// Get random 24 homes ////////////////////////
async function getHomesForHomePage(req, res) {
    try {
        const limit = 24;
        // Use aggregation to get random homes
        const homes = await home_model_1.default.aggregate([{ $sample: { size: limit } }]);
        res.status(200).json(homes);
    }
    catch (error) {
        console.error("homes-controller getHomesForHomePage : Error fetching homes", error);
        if (error instanceof Error) {
            if (error.name === "ValidationError") {
                res.status(400).json({
                    message: "homes-controller getHomesForHomePage : Validation error",
                    error: error.message,
                });
            }
            else {
                res.status(500).json({
                    message: "homes-controller getHomesForHomePage : An unexpected error occurred",
                    error: error.message,
                });
            }
        }
        else {
            res.status(500).json({
                message: "homes-controller getHomesForHomePage : An unknown error occurred",
            });
        }
    }
}
//////////////////////// Get home by Filters ////////////////////////
async function getAllHomesByFilter(req, res) {
    const { query } = req;
    const criteria = await (0, criteria_1.default)(req.query);
    let page = Number(query.page) || 1;
    if (page < 1)
        page = 1;
    const limit = Number(query.limit) || 18;
    const startIndex = (page - 1) * limit || 0;
    try {
        // Validate query parameters if needed
        if (isNaN(page) || isNaN(limit)) {
            return res.status(400).json({
                error: "homes-controller, getAllHomesByFilter: Invalid page or limit parameter",
            });
        }
        const homes = await home_model_1.default.find(criteria).skip(startIndex).limit(limit);
        // Check if any homes were found
        if (homes.length === 0) {
            return res.status(404).json({
                message: "homes-controller, getAllHomesByFilter: No homes found",
            });
        }
        res.status(200).json(homes);
    }
    catch (error) {
        console.error("homes-controller, getAllHomesByFilter: Error fetching homes:", error);
        if (error.name === "ValidationError") {
            // Handle validation errors (e.g., malformed query criteria)
            return res.status(400).json({
                error: "homes-controller, getAllHomesByFilter: Invalid criteria",
            });
        }
        // Handle other potential errors
        res.status(500).json({
            error: "homes-controller, getAllHomesByFilter: Server error, please try again later",
        });
    }
}
//////////////////////// Get home by host ////////////////////////
async function getHomesByHost(req, res) {
    const { userId } = req;
    try {
        const homes = await home_model_1.default.find({ "host._id": userId });
        // Check if any homes were found
        if (homes.length === 0) {
            return res.status(404).json({
                message: "homes-controller, getHomesByHost: No homes found for this host",
            });
        }
        res.status(200).json(homes);
    }
    catch (error) {
        console.error("homes-controller, getHomesByHost: Error fetching homes for host", error);
        if (error.name === "ValidationError") {
            // Handle validation errors (e.g., malformed query criteria)
            return res.status(400).json({
                error: "homes-controller, getAllHomesByFilter: Invalid criteria",
            });
        }
        // Handle other potential errors
        res.status(500).json({
            error: "homes-controller, getHomesByHost: Server error, please try again later",
        });
    }
}
//////////////////////// Get homes count by Filters ////////////////////////
async function getAllHomesCountByFilter(req, res) {
    const { query } = req;
    const criteria = await (0, criteria_1.default)(req.query);
    try {
        const homesCount = await home_model_1.default.countDocuments(criteria);
        res.status(200).json(homesCount);
    }
    catch (error) {
        console.error("homes-controller, getAllHomesCountByFilter: Error fetching homes:", error);
        if (error.name === "ValidationError") {
            // Handle validation errors (e.g., malformed query criteria)
            return res.status(400).json({
                error: "homes-controller, getAllHomesCountByFilter: Invalid criteria",
            });
        }
        // Handle other potential errors
        res.status(500).json({
            error: "homes-controller, getAllHomesCountByFilter: Server error, please try again later",
        });
    }
}
//////////////////////// Get home by ID ////////////////////////
async function getHomeById(req, res) {
    const { homeId } = req.params;
    try {
        const home = await home_model_1.default.findById(homeId);
        // Check if any homes were found
        if (!home) {
            return res.status(404).json({
                message: "homes-controller, getHomeById: No home found",
            });
        }
        res.status(200).json(home);
    }
    catch (error) {
        console.error("homes-controller, getHomeById: Error fetching homes:", error);
        if (error.name === "ValidationError") {
            // Handle validation errors (e.g., malformed query criteria)
            return res.status(400).json({
                error: "homes-controller, getHomeById: Invalid criteria",
            });
        }
        // Handle other potential errors
        res.status(500).json({
            error: "homes-controller, getHomeById: Server error, please try again later",
        });
    }
}
//////////////////////// Create new home ////////////////////////
async function CreateNewHome(req, res) {
    try {
        const { name, type, capacity, imgUrls, price, summary, amenities, bathrooms, bedrooms, beds, roomType, host, loc, bookingOptions, accessibility, } = req.body;
        if (!name ||
            !type ||
            capacity == null ||
            !imgUrls ||
            imgUrls.length === 0 ||
            price == null ||
            !summary ||
            !amenities ||
            amenities.length === 0 ||
            bathrooms == null ||
            bedrooms == null ||
            beds == null ||
            !roomType ||
            !host ||
            !loc ||
            !bookingOptions ||
            !accessibility) {
            return res.status(400).json({
                error: `Validation failed. Please ensure all fields are provided and correctly formatted.`,
                missingFields: {
                    name: !name,
                    type: !type,
                    capacity: capacity == null,
                    imgUrls: !imgUrls || imgUrls.length === 0,
                    price: price == null,
                    summary: !summary,
                    amenities: !amenities || amenities.length === 0,
                    bathrooms: bathrooms == null,
                    bedrooms: bedrooms == null,
                    beds: beds == null,
                    roomType: !roomType,
                    host: !host,
                    loc: !loc,
                    bookingOptions: !bookingOptions,
                    accessibility: !accessibility,
                },
            });
        }
        const newHome = new home_model_1.default({
            name,
            type,
            capacity,
            imgUrls,
            price,
            summary,
            amenities,
            bathrooms,
            bedrooms,
            beds,
            roomType,
            host,
            loc,
            bookingOptions,
            accessibility,
        });
        const savedHome = await newHome.save();
        console.log("Home created successfully:", savedHome);
        return res.status(201).json(savedHome);
    }
    catch (err) {
        console.error(`Error creating new home: ${err.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
//////////////////////// Update home ////////////////////////
async function updateHome(req, res) {
    const { userId } = req;
    const { homeId } = req.params;
    const { updatedHome } = req.body;
    try {
        // Check if the home exists
        const home = await home_model_1.default.findById(homeId);
        if (!home) {
            return res.status(404).json({
                error: "Home not found",
            });
        }
        // Check if the user is the owner of the home
        if (home.host._id.toString() !== userId) {
            return res.status(403).json({
                error: "Unauthorized - You do not own this home",
            });
        }
        // Ensure only specific fields are updated using $set
        const updated = await home_model_1.default.findOneAndUpdate({ _id: homeId, "host._id": userId }, // Ensure correct home and ownership
        { $set: updatedHome }, // Apply the update explicitly using $set
        { new: true } // Return the updated document
        );
        if (!updated) {
            return res.status(500).json({
                error: "Failed to update home",
            });
        }
        // Return the updated home
        return res.status(200).json(updated);
    }
    catch (error) {
        console.error(`Error updating home: ${error.message}`);
        return res.status(500).json({
            error: "An unexpected error occurred",
        });
    }
}
//////////////////////// Delete home by id ////////////////////////
async function deleteHomeById(req, res) {
    const { userId } = req;
    const { homeId } = req.params;
    try {
        // Check if the home exists
        const home = await home_model_1.default.findById(homeId);
        if (!home) {
            return res.status(404).json({
                error: "Home not found",
            });
        }
        // Check if the user is the owner of the home
        if (home.host._id.toString() !== userId) {
            return res.status(403).json({
                error: "Unauthorized - You do not own this home",
            });
        }
        // Ensure only specific fields are updated using $set
        const homeToDelete = await home_model_1.default.findOneAndDelete({ _id: homeId, "host._id": userId } // Ensure correct home and ownership
        );
        if (!homeToDelete) {
            return res.status(500).json({
                error: "Failed to delete home",
            });
        }
        // Return the updated home
        return res.status(200).json(homeToDelete);
    }
    catch (error) {
        console.error(`Error deleting home: ${error.message}`);
        return res.status(500).json({
            error: "An unexpected error occurred",
        });
    }
}
