"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketIO = setupSocketIO;
const chat_room_model_1 = __importDefault(require("./models/chat-room-model"));
const message_model_1 = __importDefault(require("./models/message-model"));
// Function to set up Socket.IO
function setupSocketIO(io) {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);
        // Handle join chat room
        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        });
        // Handle send message
        socket.on("sendMessage", async (roomId, senderId, message) => {
            try {
                const chat = new message_model_1.default({ chatRoom: roomId, sender: senderId, message });
                await chat.save();
                await chat_room_model_1.default.findByIdAndUpdate(roomId, {
                    $push: { messages: chat._id },
                    lastMessage: chat._id,
                    updatedAt: Date.now(),
                }).exec();
                // Emit the new message to the chat room
                io.to(roomId).emit("message", chat);
            }
            catch (error) {
                console.error("Error sending message:", error);
            }
        });
        // Handle disconnect
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
}
