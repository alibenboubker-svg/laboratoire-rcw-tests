export default class ReservationRepository {
  constructor(ReservationModel) {
    this.ReservationModel = ReservationModel;
  }

  findAll() {
    return this.ReservationModel.find().sort({ createdAt: -1 });
  }

  findById(id) {
    return this.ReservationModel.findById(id);
  }

  create(reservationData) {
    return this.ReservationModel.create(reservationData);
  }

  update(id, reservationData) {
    return this.ReservationModel.findByIdAndUpdate(id, reservationData, {
      new: true,
      runValidators: true
    });
  }

  delete(id) {
    return this.ReservationModel.findByIdAndDelete(id);
  }
}
