"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationRoutes = void 0;
const express_1 = require("express");
const reservation_middelware_1 = __importDefault(require("../middelware/reservation-middelware"));
const reservation_controller_1 = require("../controllers/reservation-controller");
const auth_middelware_1 = require("../middelware/auth-middelware");
exports.reservationRoutes = (0, express_1.Router)();
exports.reservationRoutes.get("/user", auth_middelware_1.verifyToken, reservation_controller_1.getAllUserReservations);
exports.reservationRoutes.get("/host", auth_middelware_1.verifyToken, reservation_controller_1.getAllHostReservations);
exports.reservationRoutes.get("/:homeId", reservation_controller_1.getAllHomeReservations);
exports.reservationRoutes.post("/create", auth_middelware_1.verifyToken, reservation_middelware_1.default, reservation_controller_1.createNewReservation);
exports.reservationRoutes.patch("/updateStatus/:reservationId", auth_middelware_1.verifyToken, reservation_controller_1.updateReservationStatus);
exports.reservationRoutes.delete("/delete/:reservationId", auth_middelware_1.verifyToken, reservation_controller_1.deleteReservation);
