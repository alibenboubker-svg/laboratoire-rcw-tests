import Notification from "./Notification.js";

export default class NotificationService {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  listNotifications() {
    return this.notificationRepository.findAll();
  }

  async getNotification(id) {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new Error("Notification introuvable.");
    }
    return notification;
  }

  createNotification(data) {
    const notification = new Notification(data);
    notification.validate();
    return this.notificationRepository.create(notification.toObject());
  }

  async deleteNotification(id) {
    const deletedNotification = await this.notificationRepository.delete(id);
    if (!deletedNotification) {
      throw new Error("Notification introuvable.");
    }
    return deletedNotification;
  }
}
