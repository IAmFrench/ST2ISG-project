const soap = require('soap')
const express = require('express')
const bodyParser = require('body-parser')
const { reservationSystem } = require("./reservationSystem")
let RSI = new reservationSystem()

let searchResult = RSI.search('2020-11-20', 2, 2)
console.log('[server-soap]: test searchResult ', searchResult)


let myService = {
  hotelReservationSystem: {
    MyPort: {
      MyFunction: function(args) {
        return {
          name: args.name
        };
      },
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
      }
    }
  }
}
  
let xml = require('fs').readFileSync('./server-soap/services.wsdl', 'utf8');

let app = express()
const port = 8001

app.use(bodyParser.raw({type: function(){return true;}, limit: '5mb'}))
app.listen(port, function(){
  //Note: /wsdl route will be handled by soap module
  //and all other routes & middleware will continue to work
  soap.listen(app, '/wsdl', myService, xml, function(){
    console.log(`SOAP Server listening on port ${port}!`)
  });
  app.log = function(type, data) {
    console.log('[' + type + ']' + data)
    // type is 'received' or 'replied'
  }
})