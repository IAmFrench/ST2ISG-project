// 2. Create objets (hotels and reservations)
const moment = require('moment')
const { reservation } = require('./reservation')

class hotel {
  constructor(name, rooms) {
    this.name = name
    this.rooms = this.parseRooms(rooms)
  }
  parseRooms(rooms) {
    let parsedRooms = []
    const roomsKeys = Object.keys(rooms)
    for (const roomId of roomsKeys) {
      if (rooms[roomId].hasOwnProperty('reservations')) {
        rooms[roomId].reservations.forEach((reservation) => {
          reservation.date = moment(new Date(reservation.date)).format('YYYY-MM-DD')
        })
      }
      parsedRooms.push(rooms[roomId])
    }    
    return parsedRooms
  }
}
exports.hotel = hotel