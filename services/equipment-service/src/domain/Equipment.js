export default class Equipment {
  constructor({ name, category, dailyPrice, availableQuantity } = {}) {
    this.name = typeof name === "string" ? name.trim() : "";
    this.category = typeof category === "string" ? category.trim() : "";
    this.dailyPrice = Number(dailyPrice);
    this.availableQuantity = Number(availableQuantity);
  }

  validate() {
    if (!this.name) {
      throw new Error("Le nom du materiel est obligatoire.");
    }

    if (!this.category) {
      throw new Error("La categorie du materiel est obligatoire.");
    }

    if (!Number.isFinite(this.dailyPrice) || this.dailyPrice < 0) {
      throw new Error("Le prix quotidien doit etre positif ou nul.");
    }

    if (!Number.isInteger(this.availableQuantity) || this.availableQuantity < 0) {
      throw new Error("La quantite disponible doit etre un entier positif ou nul.");
    }
  }

  canReserve(quantity) {
    const requestedQuantity = Number(quantity);
    return Number.isInteger(requestedQuantity) && requestedQuantity > 0 && this.availableQuantity >= requestedQuantity;
  }

  toObject() {
    return {
      name: this.name,
      category: this.category,
      dailyPrice: this.dailyPrice,
      availableQuantity: this.availableQuantity
    };
  }
}
