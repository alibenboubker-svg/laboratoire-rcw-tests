import Equipment from "./Equipment.js";

export default class EquipmentService {
  constructor(equipmentRepository) {
    this.equipmentRepository = equipmentRepository;
  }

  listEquipments() {
    return this.equipmentRepository.findAll();
  }

  async getEquipment(id) {
    const equipment = await this.equipmentRepository.findById(id);
    if (!equipment) {
      throw new Error("Materiel introuvable.");
    }
    return equipment;
  }

  createEquipment(data) {
    const equipment = new Equipment(data);
    equipment.validate();
    return this.equipmentRepository.create(equipment.toObject());
  }

  async updateEquipment(id, data) {
    const equipment = new Equipment(data);
    equipment.validate();

    const updatedEquipment = await this.equipmentRepository.update(id, equipment.toObject());
    if (!updatedEquipment) {
      throw new Error("Materiel introuvable.");
    }

    return updatedEquipment;
  }

  async reserveEquipment(id, quantity) {
    const requestedQuantity = this.validateQuantity(quantity);
    const equipment = await this.getEquipment(id);

    if (!new Equipment(equipment).canReserve(requestedQuantity)) {
      throw new Error("Stock insuffisant pour ce materiel.");
    }

    const updatedEquipment = await this.equipmentRepository.decreaseQuantity(id, requestedQuantity);
    if (!updatedEquipment) {
      throw new Error("Stock insuffisant pour ce materiel.");
    }

    return updatedEquipment;
  }

  async releaseEquipment(id, quantity) {
    const releasedQuantity = this.validateQuantity(quantity);
    const updatedEquipment = await this.equipmentRepository.increaseQuantity(id, releasedQuantity);
    if (!updatedEquipment) {
      throw new Error("Materiel introuvable.");
    }

    return updatedEquipment;
  }

  async deleteEquipment(id) {
    const deletedEquipment = await this.equipmentRepository.delete(id);
    if (!deletedEquipment) {
      throw new Error("Materiel introuvable.");
    }

    return deletedEquipment;
  }

  validateQuantity(quantity) {
    const parsedQuantity = Number(quantity);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      throw new Error("La quantite doit etre un entier positif.");
    }
    return parsedQuantity;
  }
}
