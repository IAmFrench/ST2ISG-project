const { reservationSystem } = require("./reservationSystem")

let RSI = new reservationSystem()

RSI.search("2020-11-20", 2, 2)


// 4. Create test scenarios
// 4.1 Make a search request
// 4.2 Select a free room and book it
// 4.3 Make a search request, the hotel room must be updated
// 4.4 Try to book that same room, it should fail



