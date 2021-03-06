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
    this.hotels = []
    this.reservations = []

    const hotelsObj = yaml.safeLoad(fs.readFileSync('./database/hotels.yaml', 'utf8'))
    const reservationsObj = yaml.safeLoad(fs.readFileSync('./database/reservations.yaml', 'utf8'))

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

      this.reservations.push(new reservation(reservationId, startDateString, duration, hotelName, rooms))
    }
  }
  search(startDate, duration = 1, roomsRequired = 1) {
    // Return an hotel name with available rooms for the asked period
    //let resultHotels = [...this.hotels] // COPY THE OBJECT, don't pass a reference
    
    // resultHotels.forEach((hotel, indexH) => {
    //   resultHotels[indexH].rooms = [...this.hotels[indexH].rooms]
    // })
    let resultHotels = []
    resultHotels = JSON.parse(JSON.stringify(this.hotels))



    // Filter per hotel size
    let indexesTobeDeleted = []
    resultHotels.forEach((hotel, indexH) => {

      // Check if number of rooms required is equal of inf to the number of rooms
      const hotelRoomsListKeys = Object.keys(hotel.rooms)
      console.log("Number of rooms in this hotel " + hotelRoomsListKeys.length)
      if (hotelRoomsListKeys.length < roomsRequired) {
        // We remove this particular hotel from the list of return hotels
        console.log(`The hotel ${hotel.name} have less room than required for this reservation (${hotelRoomsListKeys.length}, required ${roomsRequired}) skipping...`)
        indexesTobeDeleted.push(indexH)
      }
    })
    console.log("indexesTobeDeleted", indexesTobeDeleted)
    if (indexesTobeDeleted.length > 0) {
      // There is some indexes to be removed from the result hotel list
      _.pullAt(resultHotels, indexesTobeDeleted)
    }
    // Works
    console.log('Result hotel', resultHotels)


    // Search by date from hotels rooms for eachroom if it's available at the required dates
    // Find rooms that fit this constraint
    let dates = []
    for (let index = 0; index < duration; index++) {
      dates.push(moment(startDate).add(index, 'days').format('YYYY-MM-DD'))      
    }
    console.log('Dates requested for this booking: ', dates)

    let roomsToBeDeleted = []

    resultHotels.forEach((hotel, indexH) => {
      console.log('Cheking hotel ' + hotel.name + ' for availables rooms')

      let roomsToBeDeletedObj = {hotelName: hotel.name, hotelIndex: indexH, rooms: []}
      
      
      hotel.rooms.forEach((roomObj, roomIndex) => {
        console.log('[' + hotel.name + '] Cheking reservations for room ' + roomObj.roomId)

        if (roomObj.hasOwnProperty('reservations')) {
          // We will check if the reservations for this room are matching the requested dates
          const roomReservationsDates = roomObj.reservations.map((reservation) => {
            return reservation.date
          })
          console.log('This room is booked for the folllowing dates: ', roomReservationsDates)
          console.log('Checking if requested dates are available for this room...')
          const duplicatesDates = roomReservationsDates.some((val) => dates.indexOf(val) !== -1)
          if (duplicatesDates) {
            console.log('This room (' + roomObj.roomId + ') is already booked for the desired period')
            if (!roomsToBeDeleted.includes(roomObj.roomId)) {
              // Then we add this room number to the rooms to be deleted
              roomsToBeDeletedObj.rooms.push(roomObj.roomId)
            }
          }
        }
      })
      // We can now  add rooms for this hotel in the global var. of rooms to be deleted fom this search
      roomsToBeDeleted.push(roomsToBeDeletedObj)
    })

    
    // We can now delete unavailable rooms from our resultHotels variable
    roomsToBeDeleted.forEach((dHotel) => {
      // The following line is affectic the this.hotel object
      let roomIndexToBeDeleted = []
      resultHotels[dHotel.hotelIndex].rooms.forEach(sRoom => {
        dHotel.rooms.forEach((dRoom, dRoomIndex) => {
          //console.log(dRoom)
          if (sRoom.roomId == dRoom) {
            // We add here the index of the room to be deleted
            if(!roomIndexToBeDeleted.includes(dRoomIndex)) {
              roomIndexToBeDeleted.push(dRoomIndex)
            }
          }
        })
      })

      console.log(this)
      if (roomIndexToBeDeleted.length) {
        console.log('Removing unavaiblable room for hotel ' + dHotel.hotelName)
        // The following line will affect this.hotels
        _.pullAt(resultHotels[dHotel.hotelIndex].rooms, roomIndexToBeDeleted) // Remove rooms by index
        
      }
    })

    console.log(this)


    // We now check if the hotel, with unavailable romms remove has still
    // the number of requested rooms available
    // If not we delete the hotel from the result list
    let indexHotelsToBeRemoved = []
    resultHotels.forEach((hotel, indexH) => {
      if (hotel.rooms.length < roomsRequired) {
        // This hotel doesn't have enough rooms for the reservation
        // We add the index of this hotel to remove it later
        console.log('The hotel ' + hotel.hotelName + ' doesn\'t have enough rooms for this reservation, deleting...')
        indexHotelsToBeRemoved.push(indexH)
      }      
    })
    _.pullAt(resultHotels, indexHotelsToBeRemoved)
    

    // Remove "reservations" array from rooms
    resultHotels.forEach((hotel, indexH) => {
      hotel.rooms.forEach((room, indexR) => {
        if (room.hasOwnProperty('reservations')) {
          console.log('Removing reservations for room No ' + room.roomId)
          resultHotels[indexH].rooms[indexR] = {roomId: room.roomId}
        }
      })
    })

    // Build the response, return true/false, if true add the list of potentia hotels + rooms 
    if (resultHotels.length == 0) {
      return {
        code: "failure",
        data: "No hotel match your criteria"
      }
    }
    return {
      code: "success",
      data: resultHotels
    }
  }


  book(hotelName, startDate, duration = 1, roomsRequired = 1) {
    // We generate booking reservation dates
    let dates = []
    for (let index = 0; index < duration; index++) {
      dates.push(moment(startDate).add(index, 'days').format('YYYY-MM-DD'))     
    }
    let searchResult = this.search(startDate, duration, roomsRequired)
    if (searchResult.code == 'failure') {
      // No hotel match selected criterias
      return searchResult // aka the same response, failure
    }
    
    // We must check that the hotel name is in the search results
    // If yes, then we add required rooms to the selectedRooms var
    let selectedRooms = []
    searchResult.data.forEach((hotel, hotelKey) => {
      if (hotel.name == hotelName) {
        // This is the desired hotel
        // We will now add the number of required rooms
        for (let index = 0; index < roomsRequired; index++) {
          console.log('Adding room No ' + hotel.rooms[index].roomId + ' to the selection')
          selectedRooms.push(hotel.rooms[index].roomId)
        }
      }
    })
    if (selectedRooms.length == 0) {
      // That means the hotelName wasn't found in the searchResult
      return {
        code: "failure",
        data: `Reservation error: The hotel ${hotelName} doesn't have any free room`
      }
    }

    // We update "in-memory" rooms booking for selected days
    let newReservationId = 1
    if (this.reservations.length > 0) {
      newReservationId += this.reservations[this.reservations.length - 1].id
    }

    let roomReservations = []
    dates.forEach((date) => {
      roomReservations.push({
        date: date,
        reservationId: newReservationId
      })
    })

    // We search for the mathcing hotel by name
    this.hotels.forEach((hotel, hotelKey) => {
      if (hotel.name == hotelName) {
        // This is the desired hotel
        const roomsNumber = hotel.rooms.map((room, indexR) => {
          return room.roomId
        })
        selectedRooms.forEach((roomId) => {
          let index = roomsNumber.indexOf(roomId)
          hotel.rooms[index] = {
            roomId: roomId,
            reservations: roomReservations
          }
        })
        this.reservations.push(new reservation(newReservationId, startDate, duration, hotelName, selectedRooms));
      }
    })


    // We update "in-hard" (in file) rooms booking update for selected days
    // JSON to XML

    return {
      code: "success",
      data: "Reservation successful"
    }
  }
}
exports.reservationSystem = reservationSystem;
