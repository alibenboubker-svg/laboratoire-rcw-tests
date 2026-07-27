import { Router } from "express";

function sendError(res, error) {
  const notFound = error.message.includes("introuvable");
  const conflict = error.message.includes("Stock insuffisant");
  res.status(notFound ? 404 : conflict ? 409 : 400).json({ message: error.message });
}

export default function createEquipmentRoutes(equipmentService) {
  const router = Router();

  router.get("/", async (req, res) => {
    try {
      res.json(await equipmentService.listEquipments());
    } catch (error) {
      sendError(res, error);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      res.json(await equipmentService.getEquipment(req.params.id));
    } catch (error) {
      sendError(res, error);
    }
  });

  router.post("/", async (req, res) => {
    try {
      res.status(201).json(await equipmentService.createEquipment(req.body));
    } catch (error) {
      sendError(res, error);
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      res.json(await equipmentService.updateEquipment(req.params.id, req.body));
    } catch (error) {
      sendError(res, error);
    }
  });

  router.patch("/:id/reserve", async (req, res) => {
    try {
      res.json(await equipmentService.reserveEquipment(req.params.id, req.body.quantity));
    } catch (error) {
      sendError(res, error);
    }
  });

  router.patch("/:id/release", async (req, res) => {
    try {
      res.json(await equipmentService.releaseEquipment(req.params.id, req.body.quantity));
    } catch (error) {
      sendError(res, error);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await equipmentService.deleteEquipment(req.params.id);
      res.status(204).end();
    } catch (error) {
      sendError(res, error);
    }
  });

  return router;
}
