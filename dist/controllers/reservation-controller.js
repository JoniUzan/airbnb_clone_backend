"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewReservation = createNewReservation;
exports.getAllUserReservations = getAllUserReservations;
exports.getAllHostReservations = getAllHostReservations;
exports.getAllHomeReservations = getAllHomeReservations;
exports.updateReservationStatus = updateReservationStatus;
exports.deleteReservation = deleteReservation;
const reservation_model_1 = __importDefault(require("../models/reservation-model"));
const home_model_1 = __importDefault(require("../models/home-model")); // Adjust the path as needed
const user_model_1 = __importDefault(require("../models/user-model")); // Adjust the path as needed
//////////////////////// Create a new reservation ////////////////////////
async function createNewReservation(req, res) {
    try {
        const { user, home, startDate, endDate, totalPrice } = req.body;
        // Validate that all required fields are present
        if (!user || !home || !startDate || !endDate || !totalPrice) {
            return res.status(400).json({
                error: "reservation-controller createNewReservation: All required fields must be provided",
            });
        }
        // Validate that startDate is before endDate
        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({
                error: "reservation-controller createNewReservation: Start date must be before end date",
            });
        }
        // Check if the home exists and populate the host
        const homeDoc = await home_model_1.default.findById(home).populate("host");
        if (!homeDoc) {
            return res.status(404).json({
                error: "reservation-controller createNewReservation: Home not found",
            });
        }
        // Extract the host from the home document
        const host = homeDoc.host;
        // Check if the user exists
        const userExists = await user_model_1.default.findById(user);
        if (!userExists) {
            return res.status(404).json({
                error: "reservation-controller createNewReservation: User not found",
            });
        }
        // Create the reservation with the host included
        const reservation = new reservation_model_1.default({
            user,
            host, // Automatically set the host to the home’s host
            home,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            totalPrice,
            status: "pending", // Default to 'pending'
        });
        await reservation.save();
        // Respond with the created reservation
        res.status(201).json({
            message: "reservation-controller createNewReservation: Reservation created successfully",
            reservation,
        });
    }
    catch (error) {
        console.error("reservation-controller createNewReservation: Error creating reservation:", error);
        res.status(500).json({
            error: "reservation-controller createNewReservation: Server error while creating reservation",
        });
    }
}
//////////////////////// Getting all user Reservations ////////////////////////
async function getAllUserReservations(req, res) {
    const { userId } = req;
    try {
        const userReservations = await reservation_model_1.default.find({ user: userId }).populate({
            path: "home",
            populate: {
                path: "host",
                select: "fullName", // Select the host's full name from the host document
            },
            select: "name", // Select the home name from the home document
        });
        if (!userReservations || userReservations.length === 0) {
            return res.status(404).json({
                error: "reservation-controller getAllUserReservations: No reservations found for this user.",
            });
        }
        res.status(200).json(userReservations);
    }
    catch (error) {
        console.error("reservation-controller getAllUserReservations: Error fetching user reservations:", error);
        res.status(500).json({
            error: "reservation-controller getAllUserReservations: Internal server error",
        });
    }
}
//////////////////////// Getting all host Reservations ////////////////////////
async function getAllHostReservations(req, res) {
    const { userId } = req;
    try {
        const hostReservations = await reservation_model_1.default.find({ host: userId })
            .populate({
            path: "user",
            select: "firstName lastName", // Select only the firstName from the user document
        })
            .populate({
            path: "home",
            select: "name", // Select only the home name from the home document
        });
        if (!hostReservations || hostReservations.length === 0) {
            return res.status(404).json({
                error: "reservation-controller getAllHostReservations: No reservations found for this host.",
            });
        }
        res.status(200).json(hostReservations);
    }
    catch (error) {
        console.error("reservation-controller getAllHostReservations: Error fetching host reservations:", error);
        res.status(500).json({
            error: "reservation-controller getAllHostReservations: Internal server error",
        });
    }
}
//////////////////////// Get all Reservations for home ////////////////////////
async function getAllHomeReservations(req, res) {
    const { homeId } = req.params;
    try {
        const homeReservations = await reservation_model_1.default.find({ home: homeId });
        if (!homeReservations || homeReservations.length === 0) {
            return res.status(404).json({
                error: "reservation-controller getAllHomeReservations: No reservations found for this home.",
            });
        }
        res.status(200).json(homeReservations);
    }
    catch (error) {
        console.error("reservation-controller getAllHomeReservations: Error fetching home reservations:", error);
        res.status(500).json({
            error: "reservation-controller getAllHomeReservations: Internal server error",
        });
    }
}
////////////////////////Update the Reservation Status ////////////////////////
async function updateReservationStatus(req, res) {
    const { userId } = req;
    const { reservationId } = req.params;
    const { status } = req.body;
    try {
        // Find the reservation by ID
        const reservation = await reservation_model_1.default.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({
                error: "reservation-controller updateReservationStatus: Reservation not found",
            });
        }
        // Find the listing associated with the reservation
        const listing = await home_model_1.default.findById(reservation.home);
        if (!listing) {
            return res.status(404).json({
                error: "reservation-controller updateReservationStatus: Home not found",
            });
        }
        // Check if the user is the host of the listing
        if (listing.host._id.toString() !== userId) {
            return res.status(403).json({
                error: "reservation-controller updateReservationStatus: You are not authorized to change the status of this reservation",
            });
        }
        // Update the reservation status
        reservation.status = status;
        await reservation.save();
        res.status(200).json(reservation);
    }
    catch (error) {
        console.error("reservation-controller updateReservationStatus: Error updating reservation status:", error);
        res.status(500).json({
            error: "reservation-controller updateReservationStatus: Internal server error",
        });
    }
}
//////////////////////// Delete Reservation //////////////////////////
async function deleteReservation(req, res) {
    const { userId } = req;
    const { reservationId } = req.params;
    try {
        // Find the reservation by ID
        const reservation = await reservation_model_1.default.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({
                error: "reservation-controller deleteReservation: Reservation not found",
            });
        }
        // Check if the user is either the guest (user) or the host
        if (reservation.user.toString() !== userId &&
            reservation.host.toString() !== userId) {
            return res.status(403).json({
                error: "reservation-controller deleteReservation: You are not authorized to delete this reservation",
            });
        }
        // Delete the reservation
        await reservation_model_1.default.findByIdAndDelete(reservationId);
        res.status(200).json({
            message: "reservation-controller deleteReservation: Reservation deleted successfully",
        });
    }
    catch (error) {
        console.error("reservation-controller deleteReservation: Error deleting reservation:", error);
        res.status(500).json({
            error: "reservation-controller deleteReservation: Internal server error",
        });
    }
}
