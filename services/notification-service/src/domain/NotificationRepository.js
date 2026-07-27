export default class NotificationRepository {
  constructor(NotificationModel) {
    this.NotificationModel = NotificationModel;
  }

  findAll() {
    return this.NotificationModel.find().sort({ createdAt: -1 });
  }

  findById(id) {
    return this.NotificationModel.findById(id);
  }

  create(notificationData) {
    return this.NotificationModel.create(notificationData);
  }

  delete(id) {
    return this.NotificationModel.findByIdAndDelete(id);
  }
}
