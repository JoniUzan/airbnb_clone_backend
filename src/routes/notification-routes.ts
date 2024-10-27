import { Router } from 'express';
import {
    createUserNotification,
    getNotifications,
    getNotificationById,
    updateReadStatus,
    deleteNotification
} from '../controllers/notification-controller';

const router = Router();


/**
 * @swagger
 * /api/notification:
 *   post:
 *     tags: [Notifications]
 *     summary: Create notification
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - message
 *             properties:
 *               userId:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification created successfully
 *
 * /api/notification/{userId}:
 *   get:
 *     tags: [Notifications]
 *     summary: Get user notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 */
// Route to create a new notification
router.post('/', createUserNotification);

// Route to get all notifications for a user
router.get('/:userId', getNotifications);

// Route to get a single notification by ID
router.get('/notification/:id', getNotificationById);

// Route to update a notification
router.patch('/read/:id', updateReadStatus);

// Route to delete a notification
router.delete('/:id', deleteNotification);

export default router;
