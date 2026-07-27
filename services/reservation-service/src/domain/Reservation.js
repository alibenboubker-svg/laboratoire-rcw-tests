const DAY_IN_MS = 24 * 60 * 60 * 1000;

export default class Reservation {
  constructor({
    clientId,
    clientName,
    equipmentId,
    equipmentName,
    quantity,
    startDate,
    endDate,
    totalPrice,
    status
  } = {}) {
    this.clientId = typeof clientId === "string" ? clientId.trim() : "";
    this.clientName = typeof clientName === "string" ? clientName.trim() : "";
    this.equipmentId = typeof equipmentId === "string" ? equipmentId.trim() : "";
    this.equipmentName = typeof equipmentName === "string" ? equipmentName.trim() : "";
    this.quantity = Number(quantity);
    this.startDate = startDate ? new Date(startDate) : null;
    this.endDate = endDate ? new Date(endDate) : null;
    this.totalPrice = totalPrice === undefined ? 0 : Number(totalPrice);
    this.status = status || "CONFIRMED";
  }

  validate() {
    if (!this.clientId) {
      throw new Error("Le client est obligatoire.");
    }

    if (!this.equipmentId) {
      throw new Error("Le materiel est obligatoire.");
    }

    if (!Number.isInteger(this.quantity) || this.quantity <= 0) {
      throw new Error("La quantite doit etre un entier positif.");
    }

    if (!this.startDate || Number.isNaN(this.startDate.getTime())) {
      throw new Error("La date de debut est invalide.");
    }

    if (!this.endDate || Number.isNaN(this.endDate.getTime())) {
      throw new Error("La date de fin est invalide.");
    }

    if (this.endDate < this.startDate) {
      throw new Error("La date de fin doit etre apres la date de debut.");
    }
  }

  billableDays() {
    this.validate();
    return Math.ceil((this.endDate - this.startDate) / DAY_IN_MS) + 1;
  }

  calculateTotal(dailyPrice) {
    const price = Number(dailyPrice);
    if (!Number.isFinite(price) || price < 0) {
      throw new Error("Le prix du materiel est invalide.");
    }

    this.totalPrice = this.billableDays() * this.quantity * price;
    return this.totalPrice;
  }

  toObject() {
    return {
      clientId: this.clientId,
      clientName: this.clientName,
      equipmentId: this.equipmentId,
      equipmentName: this.equipmentName,
      quantity: this.quantity,
      startDate: this.startDate,
      endDate: this.endDate,
      totalPrice: this.totalPrice,
      status: this.status
    };
  }
}
