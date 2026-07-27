export default class Notification {
  constructor({ recipient, message, type, context, createdAt } = {}) {
    this.recipient = typeof recipient === "string" ? recipient.trim() : "";
    this.message = typeof message === "string" ? message.trim() : "";
    this.type = typeof type === "string" && type.trim() ? type.trim() : "INFO";
    this.context = context ?? {};
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
  }

  validate() {
    if (!this.recipient) {
      throw new Error("Le destinataire de la notification est obligatoire.");
    }

    if (!this.message) {
      throw new Error("Le message de la notification est obligatoire.");
    }

    if (Number.isNaN(this.createdAt.getTime())) {
      throw new Error("La date de notification est invalide.");
    }
  }

  toObject() {
    return {
      recipient: this.recipient,
      message: this.message,
      type: this.type,
      context: this.context,
      createdAt: this.createdAt
    };
  }
}
