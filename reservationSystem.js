const yaml = require('js-yaml')
const fs = require('fs')
const moment = require('moment')
const { hotel } = require("./hotel")
const { reservation } = require("./reservation")

// 3. Create methods
// 3.1. Get hotel list, including free rooms for a specific day and period
// 3.2. Make a reservation
class reservationSystem {
  constructor() {
    this.hotels = [];
    this.reservations = [];

    const hotelsObj = yaml.safeLoad(fs.readFileSync('./database/hotels.yaml', 'utf8'));
    const reservationsObj = yaml.safeLoad(fs.readFileSync('./database/reservations.yaml', 'utf8'));

    const hotelsListKeys = Object.keys(hotelsObj.hotels)
    for (const hotelName of hotelsListKeys) {
      this.hotels.push(new hotel(hotelName, hotelsObj.hotels[hotelName].rooms))
    }

    const reservationsListKeys = Object.keys(reservationsObj.reservations)
    for (const reservationId of reservationsListKeys) {
      const startDate = moment(reservationsObj.reservations[reservationId].startDate)
      const startDateString = startDate.format('YYYY-MM-DD')
      const endDate = moment(reservationsObj.reservations[reservationId].endDate)
      const duration = moment.duration(endDate.diff(startDate)).as('days')
      const hotelName = reservationsObj.reservations[reservationId].hotel
      const rooms = reservationsObj.reservations[reservationId].rooms

      this.reservations.push(new reservation(reservationId, startDateString, duration, hotelName, rooms));
    }
  }
  search(startDate, duration = 1, roomsRequired = 1) {
    // Return an hotel name with available rooms for the asked period
    let resulthotels = this.hotels


    // Filter per hotel size
    resulthotels.forEach((hotel, indexH) => {
      // Check if number of rooms required is equal of inf to the number of rooms
      console.log("Number of rooms in this hotel " + hotel.rooms.length)
      if (hotel.rooms.length < roomsRequired) {
        // We remove this particular hotel from the list of return hotels
        console.log('This hotel have less room than required for this reservation')
        delete resulthotels[indexH]
      }
    })
    // Reconstruct the array (trim undefinded)
    resulthotels = resulthotels.filter(function (el) {
      return el != null
    })


    // Search by date from hotels rooms for eachroom if it's available at the required dates
    // Find rooms that fit this constraint
    let dates = []
    for (let index = 0; index < duration; index++) {
      dates.push(moment(startDate).add(index, 'days').format('YYYY-MM-DD'))      
    }
    resulthotels.forEach((hotel, indexH) => {
      const hotelRoomsListKeys = Object.keys(hotel.rooms)
      for (const roomNumber of hotelRoomsListKeys) {
        if (hotel.rooms[roomNumber] != null) {
          // dates console.log()
          const roomDatesKeys = Object.keys(hotel.rooms[roomNumber].reservations)
          for (const reservationDate of roomDatesKeys) {
            console.log("r: " + moment(reservationDate).format('YYYY-MM-DD'))
          }
        }
        

      }
    })
    // Build the response, return true/false, if true add the list of potentia hotels + rooms 

  }
}
exports.reservationSystem = reservationSystem;
