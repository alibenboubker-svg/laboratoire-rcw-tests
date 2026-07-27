export default class ClientRepository {
  constructor(ClientModel) {
    this.ClientModel = ClientModel;
  }

  findAll() {
    return this.ClientModel.find().sort({ name: 1 });
  }

  findById(id) {
    return this.ClientModel.findById(id);
  }

  create(clientData) {
    return this.ClientModel.create(clientData);
  }

  update(id, clientData) {
    return this.ClientModel.findByIdAndUpdate(id, clientData, {
      new: true,
      runValidators: true
    });
  }

  delete(id) {
    return this.ClientModel.findByIdAndDelete(id);
  }
}
