const soap = require('soap')
const express = require('express')
const bodyParser = require('body-parser')
const { reservationSystem } = require("./reservationSystem")
let RSI = new reservationSystem()
let myService = {
  hotelReservationSystem: {
    MyPort: {
      filter: function(args) {
        const query = {
          startDate: args.startDate,
          duration: Number(args.duration),
          numberOfRooms: Number(args.numberOfRooms)
        }
        console.log("Query received!", query)
        let searchResult = RSI.search(query.startDate, query.duration, query.numberOfRooms)
        console.log('[server-soap] / filter: searchResult ', searchResult)
        
        return {
          query: query, 
          code: searchResult.code,
          hotels: searchResult.data
        }
      },
      book: function(args) {
        const query = {
          hotelName: args.hotelName,
          startDate: args.startDate,
          duration: Number(args.duration),
          numberOfRooms: Number(args.numberOfRooms)
        }
        console.log("Query received!", query)
        let bookresult = RSI.book(query.hotelName, query.startDate, query.duration, query.numberOfRooms)
        console.log('[server-soap] / book: bookresult ', bookresult)
        
        return {
          query: query, 
          code: bookresult.code,
          message: bookresult.data
        }
      },
    }
  }
}  
let xml = require('fs').readFileSync('./server-soap/services.wsdl', 'utf8')
let app = express()
const port = 8001
app.use(bodyParser.raw({type: function(){return true;}, limit: '5mb'}))
app.listen(port, function() {
  soap.listen(app, '/wsdl', myService, xml, function(){
    console.log(`SOAP Server listening on port ${port}!`)
  })
  app.log = function(type, data) {
    console.log('[' + type + ']' + data)
  }
})
