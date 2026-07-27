import { Router } from "express";

function sendError(res, error) {
  const notFound = error.message.includes("introuvable");
  const conflict = error.message.includes("Stock insuffisant") || error.message.includes("deja annulee");
  res.status(notFound ? 404 : conflict ? 409 : 400).json({ message: error.message });
}

export default function createReservationRoutes(reservationService) {
  const router = Router();

  router.get("/", async (req, res) => {
    try {
      res.json(await reservationService.listReservations());
    } catch (error) {
      sendError(res, error);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      res.json(await reservationService.getReservation(req.params.id));
    } catch (error) {
      sendError(res, error);
    }
  });

  router.post("/", async (req, res) => {
    try {
      res.status(201).json(await reservationService.createReservation(req.body));
    } catch (error) {
      sendError(res, error);
    }
  });

  router.patch("/:id/cancel", async (req, res) => {
    try {
      res.json(await reservationService.cancelReservation(req.params.id));
    } catch (error) {
      sendError(res, error);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await reservationService.deleteReservation(req.params.id);
      res.status(204).end();
    } catch (error) {
      sendError(res, error);
    }
  });

  return router;
}
