export default class Client {
  constructor({ name, email, phone } = {}) {
    this.name = typeof name === "string" ? name.trim() : "";
    this.email = typeof email === "string" ? email.trim().toLowerCase() : "";
    this.phone = typeof phone === "string" ? phone.trim() : "";
  }

  validate() {
    if (!this.name) {
      throw new Error("Le nom du client est obligatoire.");
    }

    if (!this.email || !this.email.includes("@")) {
      throw new Error("Le courriel du client est invalide.");
    }

    if (!this.phone) {
      throw new Error("Le telephone du client est obligatoire.");
    }
  }

  toObject() {
    return {
      name: this.name,
      email: this.email,
      phone: this.phone
    };
  }
}
