import { Router } from "express";
import {
  getHomesForHomePage,
  getAllHomesByFilter,
  getHomeById,
  getAllHomesCountByFilter,
  CreateNewHome,
  updateHome,
  getHomesByHost,
  deleteHomeById,
} from "../controllers/homes-controller";
import { verifyToken } from "../middelware/auth-middelware";

export const homeRoutes = Router();


/**
 * @swagger
 * /api/homes/24homes:
 *   get:
 *     tags: [Homes]
 *     summary: Get homes for homepage
 *     responses:
 *       200:
 *         description: List of homes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Home'
 *
 * /api/homes/filters:
 *   get:
 *     tags: [Homes]
 *     summary: Get homes by filter
 *     parameters:
 *       - in: query
 *         name: price
 *         schema:
 *           type: number
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Filtered homes list
 *
 * /api/homes/host:
 *   get:
 *     tags: [Homes]
 *     summary: Get homes by host
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of host's homes
 *
 * /api/homes/{homeId}:
 *   get:
 *     tags: [Homes]
 *     summary: Get home by ID
 *     parameters:
 *       - in: path
 *         name: homeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Home details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Home'
 */
homeRoutes.get("/24homes", getHomesForHomePage);
homeRoutes.get("/filters", getAllHomesByFilter);
homeRoutes.get("/host", verifyToken, getHomesByHost);
homeRoutes.get("/count", getAllHomesCountByFilter);
homeRoutes.get("/:homeId", getHomeById);
homeRoutes.post("/create", verifyToken, CreateNewHome);
homeRoutes.patch("/update/:homeId", verifyToken, updateHome);
homeRoutes.patch("/delete/:homeId", verifyToken, deleteHomeById);
