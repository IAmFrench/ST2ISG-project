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
      const hotelRoomsListKeys = Object.keys(hotel.rooms)
      console.log("Number of rooms in this hotel " + hotelRoomsListKeys.length)
      if (hotelRoomsListKeys.length < roomsRequired) {
        // We remove this particular hotel from the list of return hotels
        console.log('The hotel ' + hotel.name 
        + ' have less room than required for this reservation (' 
        + hotelRoomsListKeys.length + ', required ' + roomsRequired + ')')
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
      console.log('Cheking hotel ' + resulthotels[indexH].name)
      const hotelRoomsListKeys = Object.keys(resulthotels[indexH].rooms)
      let roomsToBeDeleted = []
      for (const roomNumber of hotelRoomsListKeys) {
        console.log('[' + resulthotels[indexH].name + '] Cheking room ' + roomNumber)
        if (resulthotels[indexH].rooms[roomNumber] != null) {
          const roomDatesKeys = Object.keys(resulthotels[indexH].rooms[roomNumber].reservations)
          let roomDatesFormatted = []
          for (const reservationDate of roomDatesKeys) {
            // reservationDate is a string, so we first must convert it to a date obj.
            roomDatesFormatted.push(moment(new Date(reservationDate)).format('YYYY-MM-DD'))
          }          
          dates.forEach(date => {
            if (roomDatesFormatted.includes(date)) {
              if (!roomsToBeDeleted.includes(roomNumber)) {
                console.log('THIS ROOM (' + roomNumber + ') IS ALREADY BOOKED FOR THIS DATE')
                roomsToBeDeleted.push(roomNumber)
              }
            }
          })
        }
      }
      // Delete room from current hotel
      roomsToBeDeleted.forEach(roomNumber => {
        console.log('deleting room No. ' + roomNumber + ' from hotel ' + resulthotels[indexH].name)
        delete resulthotels[indexH].rooms[roomNumber]
      })
    })
    // We now check if the hotel has the number of requested rooms available
    // If not we delete the hotel from the result list
    resulthotels.forEach((hotel, indexH) => {
      const hotelRoomsListKeys = Object.keys(resulthotels[indexH].rooms)
      if (hotelRoomsListKeys.length < roomsRequired) {
        // This hotel doesn't have enough rooms for the reservation
        delete resulthotels[indexH]
      }      
    })

    // Reconstruct the array (trim undefinded)
    resulthotels = resulthotels.filter(function (el) {
      return el != null
    })

    // Build the response, return true/false, if true add the list of potentia hotels + rooms 
    if (resulthotels.length == 0) {
      return false
    }
    return resulthotels
  }
}
exports.reservationSystem = reservationSystem;
