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

    const hotelsListKeys = Object.keys(hotelsObj.hotels);
    for (const hotelName of hotelsListKeys) {
      this.hotels.push(new hotel(hotelName, hotelsObj.hotels[hotelName].rooms));
    }

    const reservationsListKeys = Object.keys(reservationsObj.reservations);
    for (const reservationId of reservationsListKeys) {
      const startDate = moment(reservationsObj.reservations[reservationId].startDate);
      const startDateString = startDate.format('YYYY-MM-DD');
      const endDate = moment(reservationsObj.reservations[reservationId].endDate);
      const duration = moment.duration(endDate.diff(startDate)).as('days');
      const hotelName = reservationsObj.reservations[reservationId].hotel;
      const rooms = reservationsObj.reservations[reservationId].rooms;

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
        delete resulthotels[indexH]
      }
    })

    // Reconstruct the array (trim undefinded)
    resulthotels = resulthotels.filter(function (el) {
      return el != null
    })


    // TODO FROM HERE


    this.hotels.forEach((hotel, indexH) => {
      // 
      hotel.rooms.forEach((room, indexR) => {
        console.log(indexR + ": " + room)
      })
    })
  }
}
exports.reservationSystem = reservationSystem;
