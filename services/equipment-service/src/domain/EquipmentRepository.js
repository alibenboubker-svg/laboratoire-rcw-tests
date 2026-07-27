export default class EquipmentRepository {
  constructor(EquipmentModel) {
    this.EquipmentModel = EquipmentModel;
  }

  findAll() {
    return this.EquipmentModel.find().sort({ name: 1 });
  }

  findById(id) {
    return this.EquipmentModel.findById(id);
  }

  create(equipmentData) {
    return this.EquipmentModel.create(equipmentData);
  }

  update(id, equipmentData) {
    return this.EquipmentModel.findByIdAndUpdate(id, equipmentData, {
      new: true,
      runValidators: true
    });
  }

  delete(id) {
    return this.EquipmentModel.findByIdAndDelete(id);
  }

  decreaseQuantity(id, quantity) {
    return this.EquipmentModel.findOneAndUpdate(
      { _id: id, availableQuantity: { $gte: quantity } },
      { $inc: { availableQuantity: -quantity } },
      { new: true }
    );
  }

  increaseQuantity(id, quantity) {
    return this.EquipmentModel.findByIdAndUpdate(
      id,
      { $inc: { availableQuantity: quantity } },
      { new: true, runValidators: true }
    );
  }
}
