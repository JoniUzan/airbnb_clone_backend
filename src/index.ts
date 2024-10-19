import express, { Application, Express } from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import { authRoutes } from "./routes/auth-routes";
import { homeRoutes } from "./routes/homes-routes";
import { reservationRoutes } from "./routes/reservation-routes";
import { userRoutes } from "./routes/user-routes";
import { uploadRoutes } from "./routes/image-route";
import chatRouter from "./routes/chat-router";
import notificationRoutes from "./routes/notification-routes";

const app: Express = express();

async function main() {
  // Connect to database
  await connectDB();

  // Middleware
  app.use(express.json());
  app.use(
    cors({
      origin: "*", // Adjust this for production to the correct origin
      methods: ["GET", "POST", "PATCH", "DELETE"],
      credentials: true,
    })
  ); // Configure CORS properly for production

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/homes", homeRoutes);
  app.use("/api/reservation", reservationRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/images", uploadRoutes);
  app.use("/api/chat", chatRouter);
  app.use("/api/notification", notificationRoutes);

  app.get("/", (req, res) => res.json("Express on Vercel"));

  // No need to start the server explicitly, Vercel handles this
}

main();
