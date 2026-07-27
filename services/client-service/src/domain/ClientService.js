import Client from "./Client.js";

export default class ClientService {
  constructor(clientRepository) {
    this.clientRepository = clientRepository;
  }

  listClients() {
    return this.clientRepository.findAll();
  }

  async getClient(id) {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new Error("Client introuvable.");
    }
    return client;
  }

  createClient(data) {
    const client = new Client(data);
    client.validate();
    return this.clientRepository.create(client.toObject());
  }

  async updateClient(id, data) {
    const client = new Client(data);
    client.validate();

    const updatedClient = await this.clientRepository.update(id, client.toObject());
    if (!updatedClient) {
      throw new Error("Client introuvable.");
    }

    return updatedClient;
  }

  async deleteClient(id) {
    const deletedClient = await this.clientRepository.delete(id);
    if (!deletedClient) {
      throw new Error("Client introuvable.");
    }

    return deletedClient;
  }
}
