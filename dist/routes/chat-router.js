"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_controller_1 = require("../controllers/chat-controller");
const chatRouter = express_1.default.Router();
// Create or find a chat room by two users id
chatRouter.post('/chatroom', chat_controller_1.findOrCreateChatroom);
// Send a message
chatRouter.post('/chatroom/:roomId/message', chat_controller_1.sendMessage);
// Get chat history
chatRouter.get('/chatroom/:roomId', chat_controller_1.getChatHistory);
// Get room ids by user Id
chatRouter.get('/chatroom/user/:userId', chat_controller_1.getUserChatRooms);
chatRouter.get('/chatroom/room/:roomId', chat_controller_1.getParticipantsAndLastMessageByRoomId);
exports.default = chatRouter;
