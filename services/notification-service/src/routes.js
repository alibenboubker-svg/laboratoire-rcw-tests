import { Router } from "express";

function sendError(res, error) {
  const notFound = error.message.includes("introuvable");
  res.status(notFound ? 404 : 400).json({ message: error.message });
}

export default function createNotificationRoutes(notificationService) {
  const router = Router();

  router.get("/", async (req, res) => {
    try {
      res.json(await notificationService.listNotifications());
    } catch (error) {
      sendError(res, error);
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      res.json(await notificationService.getNotification(req.params.id));
    } catch (error) {
      sendError(res, error);
    }
  });

  router.post("/", async (req, res) => {
    try {
      res.status(201).json(await notificationService.createNotification(req.body));
    } catch (error) {
      sendError(res, error);
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await notificationService.deleteNotification(req.params.id);
      res.status(204).end();
    } catch (error) {
      sendError(res, error);
    }
  });

  return router;
}
