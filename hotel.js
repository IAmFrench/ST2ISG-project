// 2. Create objets (hotels and reservations)
class hotel {
  constructor(name, rooms) {
    this.name = name;
    this.rooms = rooms;
  }
  size() {
    return this.rooms.length;
  }
}
exports.hotel = hotel;
