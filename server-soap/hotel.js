// 2. Create objets (hotels and reservations)
const moment = require('moment')
const { reservation } = require('./reservation')

class hotel {
  constructor(name, rooms) {
    this.name = name
    //this.rooms = rooms
    this.rooms = this.parseRooms2(rooms)
  }


  parseRooms2(rooms) {
    let parsedRooms = []
    const roomsKeys = Object.keys(rooms)
    for (const roomId of roomsKeys) {
      //console.log(rooms[roomId])
      if (rooms[roomId].hasOwnProperty('reservations')) {
        //console.log("Reservations for " + rooms[roomId].roomId, rooms[roomId].reservations)
        rooms[roomId].reservations.forEach((reservation) => {
          reservation.date = moment(new Date(reservation.date)).format('YYYY-MM-DD')
        })
      }
      parsedRooms.push(rooms[roomId])
    }    
    return parsedRooms
  }

  parseRoom(rooms) {
    let parsedRooms = {}
    const roomsKeys = Object.keys(rooms)
    roomsKeys.forEach((roomNumber, index) => {
      if (rooms[roomNumber] != null) {
        if ("reservations" in rooms[roomNumber]) {
          // This room has at least one reservation associated with it
          // We should convert here the date of the reservation in a proper JS format (YYYY-MM-DD)
          //console.log(rooms[roomNumber])
          const roomReservationsKeys = Object.keys(rooms[roomNumber].reservations)
          let reservationsFormatted = []
          roomReservationsKeys.forEach((reservationDate, index) => {
            //console.log('original Date ' + reservationDate)
            const formattedReservationDate = moment(new Date(reservationDate)).format('YYYY-MM-DD')
            //console.log('formatted Date ' + formattedReservationDate)
            // Using this formatted Date we can 'construct' our new reservation list for this room
            reservationsFormatted.push({
              date: formattedReservationDate,
              reservationId: rooms[roomNumber].reservations[reservationDate]
            })
            //console.log(reservationsFormatted)
          })
          //console.log('Reservations for the room No ' + roomNumber + ' are ', reservationsFormatted)
          parsedRooms[roomNumber] = {
            reservations: reservationsFormatted
          }
          //parsedRooms[roomNumber] = {} // empty room, no associated reservations
          //console.log(parsedRooms)
        } 
      } else {
        parsedRooms[roomNumber] = {}
      }
    })
    //console.log(parsedRooms)
    return parsedRooms
  }
}
exports.hotel = hotel