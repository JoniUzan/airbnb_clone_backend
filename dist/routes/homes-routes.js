"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.homeRoutes = void 0;
const express_1 = require("express");
const homes_controller_1 = require("../controllers/homes-controller");
const auth_middelware_1 = require("../middelware/auth-middelware");
exports.homeRoutes = (0, express_1.Router)();
exports.homeRoutes.get("/24homes", homes_controller_1.getHomesForHomePage);
exports.homeRoutes.get("/filters", homes_controller_1.getAllHomesByFilter);
exports.homeRoutes.get("/host", auth_middelware_1.verifyToken, homes_controller_1.getHomesByHost);
exports.homeRoutes.get("/count", homes_controller_1.getAllHomesCountByFilter);
exports.homeRoutes.get("/:homeId", homes_controller_1.getHomeById);
exports.homeRoutes.post("/create", auth_middelware_1.verifyToken, homes_controller_1.CreateNewHome);
exports.homeRoutes.patch("/update/:homeId", auth_middelware_1.verifyToken, homes_controller_1.updateHome);
exports.homeRoutes.patch("/delete/:homeId", auth_middelware_1.verifyToken, homes_controller_1.deleteHomeById);
