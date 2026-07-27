import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import createReservationRoutes from "./routes.js";
import ReservationRepository from "./domain/ReservationRepository.js";
import ReservationService from "./domain/ReservationService.js";

dotenv.config();

const reservationSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true },
    clientName: { type: String, required: true },
    equipmentId: { type: String, required: true },
    equipmentName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["CONFIRMED", "CANCELED"], default: "CONFIRMED" }
  },
  { timestamps: true }
);

const ReservationModel = mongoose.model("Reservation", reservationSchema);
const reservationRepository = new ReservationRepository(ReservationModel);
const reservationService = new ReservationService(reservationRepository);

const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", (req, res) => res.json({ service: "reservation-service", status: "UP" }));
app.use("/api/reservations", createReservationRoutes(reservationService));

const port = process.env.PORT || 4003;
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventia_reservations";

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port, () => console.log(`reservation-service sur le port ${port}`));
  })
  .catch((error) => {
    console.error("Connexion MongoDB impossible:", error.message);
    process.exit(1);
  });
