import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import createClientRoutes from "./routes.js";
import ClientRepository from "./domain/ClientRepository.js";
import ClientService from "./domain/ClientService.js";

dotenv.config();

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

const ClientModel = mongoose.model("Client", clientSchema);
const clientRepository = new ClientRepository(ClientModel);
const clientService = new ClientService(clientRepository);

const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", (req, res) => res.json({ service: "client-service", status: "UP" }));
app.use("/api/clients", createClientRoutes(clientService));

const port = process.env.PORT || 4001;
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventia_clients";

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port, () => console.log(`client-service sur le port ${port}`));
  })
  .catch((error) => {
    console.error("Connexion MongoDB impossible:", error.message);
    process.exit(1);
  });
