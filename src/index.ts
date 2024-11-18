import express, { Application, Express } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { connectDB } from "./config/db";
import { authRoutes } from "./routes/auth-routes";
import { homeRoutes } from "./routes/homes-routes";
import { reservationRoutes } from "./routes/reservation-routes";
import { userRoutes } from "./routes/user-routes";
import { uploadRoutes } from "./routes/image-route";
import chatRouter from "./routes/chat-router";
import notificationRoutes from "./routes/notification-routes";
// import socketMiddleware from "./middelware/auth-req";
import { setupSocketIO } from "./socket"; // Import the Socket.IO setup

const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  "http://localhost:5173/",
  "http://localhost:3000", // for local development
  "https://airbnb-clone-frontend-self.vercel.app", // for Vercel production
];
const app: Express = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Use the same allowedOrigins array
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

setupSocketIO(io); // Set up Socket.IO

async function main() {
  // Connect to database
  await connectDB();

  // Middleware
  app.use(express.json());

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin like mobile apps or curl requests
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg =
            "The CORS policy for this site does not allow access from the specified origin.";
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      methods: ["GET", "POST", "PATCH", "DELETE"],
      credentials: true, // Include credentials if needed (cookies, etc.)
    })
  );

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/homes", homeRoutes);
  app.use("/api/reservation", reservationRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/images", uploadRoutes);
  app.use("/api/chat", chatRouter);
  app.use("/api/notification", notificationRoutes);

  app.get("/", (req, res) => res.json("Express on render"));

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main();
