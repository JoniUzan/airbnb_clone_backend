"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const reviewSchema = new mongoose_1.Schema({
    at: {
        type: Date,
        required: true,
    },
    by: {
        _id: {
            type: String,
        },
        fullname: {
            type: String,
            required: true,
        },
        imgUrl: {
            type: String,
        },
    },
    txt: {
        type: String,
    },
    rate: {
        Cleanliness: { type: Number, required: true },
        Communication: { type: Number, required: true },
        "Check-in": { type: Number, required: true },
        Accuracy: { type: Number, required: true },
        Location: { type: Number, required: true },
        Value: { type: Number, required: true },
    },
});
const locationSchema = new mongoose_1.Schema({
    country: {
        type: String,
        required: true,
    },
    countryCode: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    lat: {
        type: Number,
        required: true,
    },
    lan: {
        type: Number,
        required: true,
    },
});
const hostSchema = new mongoose_1.Schema({
    language: { type: [String], require: true },
    _id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    about: {
        type: String,
    },
    thumbnailUrl: {
        type: String,
    },
    imgUrl: {
        type: String,
    },
    isSuperhost: {
        type: Boolean,
    },
});
const homeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    capacity: { type: Number, require: true },
    imgUrls: {
        type: [String],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    amenities: {
        type: [String],
        default: []
    },
    bathrooms: {
        type: Number,
        required: true,
    },
    bedrooms: {
        type: Number,
        required: true,
    },
    beds: {
        type: Number,
    },
    roomType: {
        type: String,
        required: true,
    },
    host: {
        type: hostSchema,
        required: true,
    },
    loc: {
        type: locationSchema,
        required: true,
    },
    reviews: [reviewSchema],
    likedByUsers: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        default: [],
    },
    bookingOptions: {
        InstantBook: { type: Boolean, required: true },
        SelfCheckIn: { type: Boolean, required: true },
        AllowsPets: { type: Boolean, required: true },
    },
    accessibility: { type: [String], default: [] },
});
const Home = mongoose_1.default.model("Home", homeSchema);
exports.default = Home;
