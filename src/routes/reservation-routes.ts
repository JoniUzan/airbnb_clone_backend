import { Router } from "express";
import checkDateAvailability from "../middelware/reservation-middelware";
import {
  createNewReservation,
  deleteReservation,
  getAllHomeReservations,
  getAllHostReservations,
  getAllUserReservations,
  updateReservationStatus,
} from "../controllers/reservation-controller";
import { verifyToken } from "../middelware/auth-middelware";

export const reservationRoutes = Router();

/**
 * @swagger
 * /api/reservation/user:
 *   get:
 *     tags: [Reservations]
 *     summary: Get all user reservations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user reservations
 *
 * /api/reservation/create:
 *   post:
 *     tags: [Reservations]
 *     summary: Create new reservation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - homeId
 *               - startDate
 *               - endDate
 *             properties:
 *               homeId:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Reservation created successfully
 */
reservationRoutes.get("/user", verifyToken, getAllUserReservations);
reservationRoutes.get("/host", verifyToken, getAllHostReservations);
reservationRoutes.get("/:homeId", getAllHomeReservations);
reservationRoutes.post(
  "/create",
  verifyToken,
  checkDateAvailability,
  createNewReservation
);
reservationRoutes.patch(
  "/updateStatus/:reservationId",
  verifyToken,
  updateReservationStatus
);
reservationRoutes.delete(
  "/delete/:reservationId",
  verifyToken,
  deleteReservation
);
