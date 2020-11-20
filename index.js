const yaml = require('js-yaml')
const fs   = require('fs')
const moment = require('moment')

// 1. Load the database from the file
const hotelsObj = yaml.safeLoad(fs.readFileSync('./database/hotels.yaml', 'utf8'))
const reservationsObj = yaml.safeLoad(fs.readFileSync('./database/reservations.yaml', 'utf8'))

// 2. Create objets (hotels and reservations)
class hotel {
  constructor(name, rooms) {
    this.name = name
    this.rooms = rooms
  }
  size() {
    return this.rooms.length
  }
}


let hotelsList = []
const hotelsListKeys = Object.keys(hotelsObj.hotels)
for (const hotelName of hotelsListKeys) {
  hotelsList.push(new hotel(hotelName, hotelsObj.hotels[hotelName].rooms))
}
console.log("Size of hotel 2", hotelsList[1].size())


class reservation {
  constructor(id, startDate, duration, hotelName, rooms) {
    this.id = id
    this.startDate = startDate
    this.duration = duration
    this.hotelName = hotelName
    this.rooms = rooms
  }
}


let reservationsList = []
const reservationsListKeys = Object.keys(reservationsObj.reservations)
for (const reservationId of reservationsListKeys) {
  const startDate = moment(reservationsObj.reservations[reservationId].startDate)
  const startDateString = startDate.format('YYYY-MM-DD')
  const endDate = moment(reservationsObj.reservations[reservationId].endDate)
  const duration = moment.duration(endDate.diff(startDate)).as('days')
  const hotelName = reservationsObj.reservations[reservationId].hotel
  const rooms = reservationsObj.reservations[reservationId].rooms
  
  reservationsList.push(new reservation(reservationId, startDateString, duration, hotelName, rooms))
}

console.log(hotelsList)
console.log(reservationsList)

// 3. Create methods
// 3.1. Get hotel list, including free rooms for a specific day and period
// 3.2. Make a reservation



// 4. Create test scenarios
// 4.1 Make a search request
// 4.2 Select a free room and book it
// 4.3 Make a search request, the hotel room must be updated
// 4.4 Try to book that same room, it should fail
 


