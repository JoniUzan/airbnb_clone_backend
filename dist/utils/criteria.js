"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reservation_model_1 = __importDefault(require("../models/reservation-model"));
// Define the criteria function
async function makeCriteria(query) {
    const res = {};
    // Type
    if (query.type) {
        res.type = { $regex: query.type, $options: "i" };
    }
    // Room Type
    if (query.roomType) {
        res.roomType = { $regex: query.roomType, $options: "i" };
    }
    // Price Range
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
        res.price = {};
        if (query.minPrice !== undefined) {
            res.price.$gte = query.minPrice;
        }
        if (query.maxPrice !== undefined) {
            res.price.$lte = query.maxPrice;
        }
    }
    // Bedrooms
    if (query.bedrooms !== undefined && query.bedrooms !== "") {
        res.bedrooms = Number(query.bedrooms);
    }
    // Beds
    if (query.beds !== undefined && query.beds !== "") {
        res.beds = Number(query.beds);
    }
    // Bathrooms
    if (query.bathrooms !== undefined && query.bathrooms !== "") {
        res.bathrooms = Number(query.bathrooms);
    }
    // Capacity
    if (query.capacity !== undefined) {
        res.capacity = { $gte: query.capacity };
    }
    // Host Language
    if (query.hostLanguage) {
        const languages = Array.isArray(query.hostLanguage)
            ? query.hostLanguage
            : query.hostLanguage.split(","); // Correctly split by comma
        res["host.language"] = { $all: languages };
    }
    // Amenities
    if (query.amenities) {
        const amenities = Array.isArray(query.amenities)
            ? query.amenities
            : query.amenities.split(","); // Correctly split by comma
        res.amenities = { $all: amenities };
    }
    // Accessibility
    if (query.accessibility) {
        const accessibility = Array.isArray(query.accessibility)
            ? query.accessibility
            : query.accessibility.split(","); // Correctly split by comma
        res.accessibility = { $all: accessibility };
    }
    // Booking Options
    if (query.InstantBook !== undefined && query.InstantBook !== "") {
        res["bookingOptions.InstantBook"] = query.InstantBook;
    }
    if (query.SelfCheckIn !== undefined && query.SelfCheckIn !== "") {
        res["bookingOptions.SelfCheckIn"] = query.SelfCheckIn;
    }
    if (query.AllowsPets !== undefined && query.AllowsPets !== "") {
        res["bookingOptions.AllowsPets"] = query.AllowsPets;
    }
    // Location
    if (query.location) {
        res.$or = [
            { "loc.country": { $regex: query.location, $options: "i" } },
            { "loc.city": { $regex: query.location, $options: "i" } },
            { "loc.address": { $regex: query.location, $options: "i" } },
        ];
    }
    // Date Availability
    if (query.startDate && query.endDate) {
        const startDate = new Date(query.startDate);
        const endDate = new Date(query.endDate);
        // Find homes that have no conflicting reservations
        const reservedHomeIds = await reservation_model_1.default.find({
            $or: [
                { startDate: { $lt: endDate, $gte: startDate } },
                { endDate: { $gt: startDate, $lte: endDate } },
                { startDate: { $lte: startDate }, endDate: { $gte: endDate } },
            ],
        }).distinct("home");
        // Exclude homes that are already reserved
        res._id = { $nin: reservedHomeIds };
    }
    return res;
}
exports.default = makeCriteria;
