import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import createEquipmentRoutes from "./routes.js";
import EquipmentRepository from "./domain/EquipmentRepository.js";
import EquipmentService from "./domain/EquipmentService.js";

dotenv.config();

const equipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    dailyPrice: { type: Number, required: true, min: 0 },
    availableQuantity: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

const EquipmentModel = mongoose.model("Equipment", equipmentSchema);
const equipmentRepository = new EquipmentRepository(EquipmentModel);
const equipmentService = new EquipmentService(equipmentRepository);

const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", (req, res) => res.json({ service: "equipment-service", status: "UP" }));
app.use("/api/equipments", createEquipmentRoutes(equipmentService));

const port = process.env.PORT || 4002;
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventia_equipment";

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port, () => console.log(`equipment-service sur le port ${port}`));
  })
  .catch((error) => {
    console.error("Connexion MongoDB impossible:", error.message);
    process.exit(1);
  });
