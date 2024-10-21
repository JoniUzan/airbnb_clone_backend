"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification-controller");
const router = (0, express_1.Router)();
// Route to create a new notification
router.post('/', notification_controller_1.createUserNotification);
// Route to get all notifications for a user
router.get('/:userId', notification_controller_1.getNotifications);
// Route to get a single notification by ID
router.get('/notification/:id', notification_controller_1.getNotificationById);
// Route to update a notification
router.patch('/read/:id', notification_controller_1.updateReadStatus);
// Route to delete a notification
router.delete('/:id', notification_controller_1.deleteNotification);
exports.default = router;
