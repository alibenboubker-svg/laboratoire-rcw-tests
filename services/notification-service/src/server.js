import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import createNotificationRoutes from "./routes.js";
import NotificationRepository from "./domain/NotificationRepository.js";
import NotificationService from "./domain/NotificationService.js";

dotenv.config();

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, default: "INFO", trim: true },
    context: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model("Notification", notificationSchema);
const notificationRepository = new NotificationRepository(NotificationModel);
const notificationService = new NotificationService(notificationRepository);

const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", (req, res) => res.json({ service: "notification-service", status: "UP" }));
app.use("/api/notifications", createNotificationRoutes(notificationService));

const port = process.env.PORT || 4004;
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventia_notifications";

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port, () => console.log(`notification-service sur le port ${port}`));
  })
  .catch((error) => {
    console.error("Connexion MongoDB impossible:", error.message);
    process.exit(1);
  });
