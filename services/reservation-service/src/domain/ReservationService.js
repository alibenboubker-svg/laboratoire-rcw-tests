import axios from "axios";
import Reservation from "./Reservation.js";

export default class ReservationService {
  constructor(reservationRepository) {
    this.reservationRepository = reservationRepository;
    this.clientServiceUrl = process.env.CLIENT_SERVICE_URL || "http://localhost:4001/api/clients";
    this.equipmentServiceUrl = process.env.EQUIPMENT_SERVICE_URL || "http://localhost:4002/api/equipments";
    this.notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:4004/api/notifications";
  }

  listReservations() {
    return this.reservationRepository.findAll();
  }

  async getReservation(id) {
    const reservation = await this.reservationRepository.findById(id);
    if (!reservation) {
      throw new Error("Reservation introuvable.");
    }
    return reservation;
  }

  async createReservation(data) {
    const reservation = new Reservation(data);
    reservation.validate();

    const client = await this.fetchClient(reservation.clientId);
    const equipment = await this.fetchEquipment(reservation.equipmentId);

    reservation.clientName = client.name;
    reservation.equipmentName = equipment.name;
    reservation.calculateTotal(equipment.dailyPrice);

    await this.reserveStock(reservation.equipmentId, reservation.quantity);

    try {
      const savedReservation = await this.reservationRepository.create(reservation.toObject());
      await this.notify({
        recipient: client.email || client.name,
        type: "RESERVATION_CONFIRMED",
        message: `Reservation confirmee pour ${equipment.name}.`,
        context: { reservationId: savedReservation._id }
      });
      return savedReservation;
    } catch (error) {
      await this.releaseStock(reservation.equipmentId, reservation.quantity);
      throw error;
    }
  }

  async cancelReservation(id) {
    const reservation = await this.getReservation(id);
    if (reservation.status === "CANCELED") {
      throw new Error("La reservation est deja annulee.");
    }

    await this.releaseStock(reservation.equipmentId, reservation.quantity);

    const updatedReservation = await this.reservationRepository.update(id, {
      status: "CANCELED"
    });

    await this.notify({
      recipient: reservation.clientName,
      type: "RESERVATION_CANCELED",
      message: `Reservation annulee pour ${reservation.equipmentName}.`,
      context: { reservationId: reservation._id }
    });

    return updatedReservation;
  }

  async deleteReservation(id) {
    const deletedReservation = await this.reservationRepository.delete(id);
    if (!deletedReservation) {
      throw new Error("Reservation introuvable.");
    }
    return deletedReservation;
  }

  async fetchClient(clientId) {
    try {
      const response = await axios.get(`${this.clientServiceUrl}/${clientId}`);
      return response.data;
    } catch (error) {
      throw new Error("Client introuvable.");
    }
  }

  async fetchEquipment(equipmentId) {
    try {
      const response = await axios.get(`${this.equipmentServiceUrl}/${equipmentId}`);
      return response.data;
    } catch (error) {
      throw new Error("Materiel introuvable.");
    }
  }

  async reserveStock(equipmentId, quantity) {
    try {
      await axios.patch(`${this.equipmentServiceUrl}/${equipmentId}/reserve`, { quantity });
    } catch (error) {
      const message = error.response?.data?.message || "Stock insuffisant pour ce materiel.";
      throw new Error(message);
    }
  }

  async releaseStock(equipmentId, quantity) {
    try {
      await axios.patch(`${this.equipmentServiceUrl}/${equipmentId}/release`, { quantity });
    } catch (error) {
      throw new Error(error.response?.data?.message || "Impossible de remettre le materiel en disponibilite.");
    }
  }

  async notify(notificationData) {
    try {
      await axios.post(this.notificationServiceUrl, notificationData);
    } catch (error) {
      console.error("Notification non enregistree:", error.message);
    }
  }
}
