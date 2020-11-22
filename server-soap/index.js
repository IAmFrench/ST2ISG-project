const soap = require('soap')
const express = require('express')
const bodyParser = require('body-parser')

const { reservationSystem } = require("./reservationSystem")

let RSI = new reservationSystem()




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
        console.log(query)
        let searchResult = RSI.search(query.startDate, query.duration, query.numberOfRooms)
        searchResult.query = query
        const response = {...new Object(searchResult)}
        console.log(response)
        //return searchResult
        return {
          query: query, 
          code: searchResult.code,
          hotels: searchResult.data
        }
      }
    }
  }
}
  
let xml = require('fs').readFileSync('services.wsdl', 'utf8');

let app = express();

app.use(bodyParser.raw({type: function(){return true;}, limit: '5mb'}))
app.listen(8001, function(){
  //Note: /wsdl route will be handled by soap module
  //and all other routes & middleware will continue to work
  soap.listen(app, '/wsdl', myService, xml, function(){
    console.log('server initialized')
  });
  app.log = function(type, data) {
    console.log('[' + type + ']' + data)
    // type is 'received' or 'replied'
  }
})