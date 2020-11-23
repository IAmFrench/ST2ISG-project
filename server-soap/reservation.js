class reservation {
  constructor(id, startDate, duration, hotelName, rooms) {
    this.id = Number(id);
    this.startDate = startDate;
    this.duration = duration;
    this.hotelName = hotelName;
    this.rooms = rooms;
  }
}
exports.reservation = reservation;
