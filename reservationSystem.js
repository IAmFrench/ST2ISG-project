const yaml = require('js-yaml')
const fs = require('fs')
const moment = require('moment')
var _ = require('lodash')
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
    let resultHotels = [...this.hotels] // COPY THE OBJECT, don't pass a reference

    // Filter per hotel size
    resultHotels.forEach((hotel, indexH) => {
      // Check if number of rooms required is equal of inf to the number of rooms
      const hotelRoomsListKeys = Object.keys(hotel.rooms)
      console.log("Number of rooms in this hotel " + hotelRoomsListKeys.length)
      if (hotelRoomsListKeys.length < roomsRequired) {
        // We remove this particular hotel from the list of return hotels
        console.log('The hotel ' + hotel.name 
        + ' have less room than required for this reservation (' 
        + hotelRoomsListKeys.length + ', required ' + roomsRequired + ')')
        delete resultHotels[indexH]
      }
    })
    // Reconstruct the array (trim undefinded)
    resultHotels = resultHotels.filter(function (el) {
      return el != null
    })


    // Search by date from hotels rooms for eachroom if it's available at the required dates
    // Find rooms that fit this constraint
    let dates = []
    for (let index = 0; index < duration; index++) {
      dates.push(moment(startDate).add(index, 'days').format('YYYY-MM-DD'))      
    }
    resultHotels.forEach((hotel, indexH) => {
      console.log('Cheking hotel ' + hotel.name)
      const hotelRoomsListKeys = Object.keys(hotel.rooms)
      let roomsToBeDeleted = []
      for (const roomNumber of hotelRoomsListKeys) {
        console.log('[' + hotel.name + '] Cheking room ' + roomNumber)
        if (hotel.rooms[roomNumber] != null) {
          const roomDatesKeys = Object.keys(hotel.rooms[roomNumber].reservations)
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
      console.log(this)
      console.log(resultHotels)
      console.log(this.hotels[1] === resultHotels)
      roomsToBeDeleted.forEach((roomNumber, roomNumberIndex) => {
        console.log('deleting room No. ' + roomNumber + ' from hotel ' + resultHotels[indexH].name)
        delete hotel.rooms[roomNumber]
        
        // Do the same using the loadash
        //hotel.rooms = _.omit(hotel.rooms, [roomNumber])
      })
      console.log(this)
    })
    // We now check if the hotel has the number of requested rooms available
    // If not we delete the hotel from the result list
    resultHotels.forEach((hotel, indexH) => {
      const hotelRoomsListKeys = Object.keys(resultHotels[indexH].rooms)
      if (hotelRoomsListKeys.length < roomsRequired) {
        // This hotel doesn't have enough rooms for the reservation
        delete resultHotels[indexH]
      }      
    })

    // Reconstruct the array (trim undefinded)
    resultHotels = resultHotels.filter(function (el) {
      return el != null
    })

    // Build the response, return true/false, if true add the list of potentia hotels + rooms 
    if (resultHotels.length == 0) {
      return {
        code: "failure",
        data: "hotel not found"
      }
    }
    return {
      code: "success",
      data: resultHotels
    }
  }


  book(hotelName, startDate, duration = 1, roomsRequired = 1, selectedRooms = []) {
    // We generate booking reservation dates
    let dates = []
    for (let index = 0; index < duration; index++) {
      dates.push(moment(startDate).add(index, 'days').format('YYYY-MM-DD'))     
    }

    if (selectedRooms.length == 0) {
      let searchResult = this.search(startDate, duration, roomsRequired)
      if (searchResult.code == 'failure') {
        // No hotel match selected criterias
        return searchResult // aka the same response, failure
      }

      // We must check that the hotel name is in the search results
      searchResult.data.forEach((hotel, hotelKey) => {
        console.log(hotel.name, hotelKey)
        if (hotel.name == hotelName) {
          // This is the desired hotel
          const hotelRoomsListKeys = Object.keys(hotel.rooms)
          for (let index = 0; index < roomsRequired; index++) {
            let roomNumber = hotelRoomsListKeys[index]
            selectedRooms.push(roomNumber)
          }
        }
      })
      if (selectedRooms.length == 0) {
        // That means the hotelName wasn't found in the searchResult
        return {
          code: "failure",
          data: "no hotel match your booking criterias"
        }
      }
    }
    console.log(selectedRooms)


    // We update "in-memory" rooms booking for selected days
    this.hotels.forEach((hotel, hotelKey) => {
      if (hotel.name == hotelName) {
        selectedRooms.forEach(roomNumber => {
          // We add a reservation number to the room number by a selected date
          //hotel.rooms[roomNumber]
        })
      }
    })
    // We update "in-hard" (in file) rooms booking update for selected days

  }
}
exports.reservationSystem = reservationSystem;
