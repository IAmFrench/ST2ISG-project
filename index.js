const { reservationSystem } = require("./server-soap/reservationSystem")

let RSI = new reservationSystem()


//let searchResult = RSI.search("2020-11-20", 2, 2)
//console.log(searchResult)

let bookingResult = RSI.book("Econo Lodge", "2020-11-20", 2, 1)
console.log(bookingResult)


// 4. Create test scenarios
// 4.1 Make a search request -> OK
// 4.2 Select a free room and book it -> In progress
// 4.3 Make a search request, the hotel room must be updated
// 4.4 Try to book that same room, it should fail



