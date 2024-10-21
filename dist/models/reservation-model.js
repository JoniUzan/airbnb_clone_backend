"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Create a Schema corresponding to the document interface.
const ReservationSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    host: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    home: { type: mongoose_1.Schema.Types.ObjectId, ref: "Home", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
    },
}, { timestamps: true });
// Create a Model.
const Reservation = (0, mongoose_1.model)("Reservation", ReservationSchema);
exports.default = Reservation;
