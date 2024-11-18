import express from "express";
import { findOrCreateChatroom, getChatHistory, getParticipantsAndLastMessageByRoomId, getUserChatRooms, sendMessage } from "../controllers/chat-controller";

const chatRouter = express.Router();


/**
 * @swagger
 * /api/chat/chatroom:
 *   post:
 *     tags: [Chat]
 *     summary: Create or find chatroom
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participantIds
 *             properties:
 *               participantIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Chatroom details
 *
 * /api/chat/chatroom/{roomId}/message:
 *   post:
 *     tags: [Chat]
 *     summary: Send a message
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 */
// Create or find a chat room by two users id
chatRouter.post('/chatroom', findOrCreateChatroom);

// Send a message
chatRouter.post('/chatroom/:roomId/message', sendMessage);

// Get chat history
chatRouter.get('/chatroom/:roomId', getChatHistory);

// Get room ids by user Id
chatRouter.get('/chatroom/user/:userId', getUserChatRooms)

chatRouter.get('/chatroom/room/:roomId', getParticipantsAndLastMessageByRoomId)

export default chatRouter