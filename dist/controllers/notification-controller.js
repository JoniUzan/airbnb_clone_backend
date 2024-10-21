"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserNotification = createUserNotification;
exports.getNotifications = getNotifications;
exports.getNotificationById = getNotificationById;
exports.updateReadStatus = updateReadStatus;
exports.deleteNotification = deleteNotification;
const notification_model_1 = __importDefault(require("../models/notification-model"));
// Create a new notification
async function createUserNotification(req, res) {
    try {
        const { userId, message, reservationId } = req.body;
        if (!userId || !message || !reservationId) {
            return res.status(400).json({ error: 'User ID, message, and reservation ID are required' });
        }
        // Create notification for the user
        const newNotificationForUser = new notification_model_1.default({
            userId,
            message,
        });
        const savedNotificationForUser = await newNotificationForUser.save();
        res.status(201).json({ savedNotificationForUser });
    }
    catch (error) {
        console.error("Error creating user notification:", error);
        res.status(500).json({ error: "An error occurred while creating the user notification" });
    }
}
// Get all notifications for a specific user
async function getNotifications(req, res) {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const notifications = await notification_model_1.default.find({ userId }).exec();
        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ message: 'No notifications found for this user' });
        }
        res.status(200).json(notifications);
    }
    catch (error) {
        console.error("Error retrieving notifications:", error);
        res.status(500).json({ error: "An error occurred while retrieving notifications" });
    }
}
// Get a single notification by ID
async function getNotificationById(req, res) {
    try {
        const { id } = req.params;
        const notification = await notification_model_1.default.findById(id).exec();
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json(notification);
    }
    catch (error) {
        console.error("Error retrieving notification:", error);
        res.status(500).json({ error: "An error occurred while retrieving the notification" });
    }
}
// Update a notification
async function updateReadStatus(req, res) {
    try {
        const { id } = req.params;
        const { read } = req.body;
        // Ensure that the 'read' property is a boolean
        if (typeof read !== 'boolean') {
            return res.status(400).json({ error: 'The read status must be a boolean' });
        }
        const updatedNotification = await notification_model_1.default.findByIdAndUpdate(id, { read }, { new: true }).exec();
        if (!updatedNotification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json(updatedNotification);
    }
    catch (error) {
        console.error("Error updating notification:", error);
        res.status(500).json({ error: "An error occurred while updating the notification" });
    }
}
// Delete a notification
async function deleteNotification(req, res) {
    try {
        const { id } = req.params;
        const deletedNotification = await notification_model_1.default.findByIdAndDelete(id).exec();
        if (!deletedNotification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json({ message: 'Notification deleted successfully' });
    }
    catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ error: "An error occurred while deleting the notification" });
    }
}
