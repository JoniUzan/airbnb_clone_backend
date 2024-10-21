"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrCreateChatroom = findOrCreateChatroom;
exports.sendMessage = sendMessage;
exports.getChatHistory = getChatHistory;
exports.getUserChatRooms = getUserChatRooms;
exports.getParticipantsAndLastMessageByRoomId = getParticipantsAndLastMessageByRoomId;
const chat_room_model_1 = __importDefault(require("../models/chat-room-model"));
const message_model_1 = __importDefault(require("../models/message-model"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../index");
// Create or find a chat room between two users
async function findOrCreateChatroom(req, res) {
    // Extract user IDs, sender, and message from query parameters
    const userId1 = req.query.userId1;
    const userId2 = req.query.userId2;
    const senderId = req.query.senderId;
    const messageText = req.query.message;
    if (!userId1 || !userId2 || !senderId || !messageText) {
        return res.status(400).json({ error: 'userId1, userId2, senderId, and message are required' });
    }
    // Create an array of user IDs
    const userIds = [userId1, userId2];
    // Check for existing chatroom with the participants
    let chatRoom = await chat_room_model_1.default.findOne({
        participants: { $all: userIds, $size: userIds.length }
    }).exec();
    // If no chatroom is found, create a new one
    if (!chatRoom) {
        chatRoom = new chat_room_model_1.default({ participants: userIds });
        await chatRoom.save();
        // Create the new message with explicit type
        const newMessage = new message_model_1.default({
            chatRoom: chatRoom._id,
            sender: senderId,
            message: messageText,
        });
        // Save the message to the database
        await newMessage.save();
        // Update the chatroom with the last message
        chatRoom.lastMessage = newMessage._id; // Explicitly cast to ObjectId
        chatRoom.messages.push(newMessage._id); // Explicitly cast to ObjectId
        await chatRoom.save();
    }
    res.status(200).json(chatRoom);
}
// Send a message
async function sendMessage(req, res) {
    const { roomId } = req.params;
    const { senderId, message } = req.body;
    try {
        const chat = new message_model_1.default({ chatRoom: roomId, sender: senderId, message });
        await chat.save();
        await chat_room_model_1.default.findByIdAndUpdate(roomId, {
            $push: { messages: chat._id },
            lastMessage: chat._id,
            updatedAt: Date.now(),
        }).exec();
        // Emit the new message to the chat room via Socket.IO
        index_1.io.to(roomId).emit("message", chat);
        res.status(200).json(chat);
    }
    catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "An error occurred while sending the message" });
    }
}
// Get chat history
async function getChatHistory(req, res) {
    const { roomId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(roomId)) {
        return res.status(400).json({ message: "Invalid room ID" });
    }
    const chatRoom = await chat_room_model_1.default.findById(roomId)
        .populate('messages')
        .populate('participants', 'name email firstName lastName')
        .exec();
    if (!chatRoom) {
        return res.status(404).json({ message: "Chat room not found" });
    }
    res.status(200).json(chatRoom);
}
// Get all chatroom IDs for a specific user
async function getUserChatRooms(req, res) {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        // Find all chatrooms where the user is a participant
        const chatRooms = await chat_room_model_1.default.find({
            participants: userId
        }).select('_id');
        if (!chatRooms || chatRooms.length === 0) {
            return res.status(404).json({ message: "No chat rooms found for this user" });
        }
        // Map to extract chat room IDs
        const chatRoomIds = chatRooms.map(chatRoom => chatRoom._id);
        res.status(200).json(chatRoomIds);
    }
    catch (error) {
        console.error("Error retrieving chat rooms:", error);
        res.status(500).json({ error: "An error occurred while retrieving chat rooms" });
    }
}
// Get participants and last message by room ID
async function getParticipantsAndLastMessageByRoomId(req, res) {
    const { roomId } = req.params;
    try {
        // Find the chat room by ID and populate the participants and lastMessage fields
        const chatRoom = await chat_room_model_1.default.findById(roomId)
            .populate('participants', 'name email firstName lastName')
            .populate('lastMessage')
            .exec();
        if (!chatRoom) {
            return res.status(404).json({ message: "Chat room not found" });
        }
        // Return participants and last message
        res.status(200).json({
            participants: chatRoom.participants,
            lastMessage: chatRoom.lastMessage,
        });
    }
    catch (error) {
        console.error("Error retrieving participants and last message:", error);
        res.status(500).json({ error: "An error occurred while retrieving participants and last message" });
    }
}
