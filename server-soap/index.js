const soap = require('soap')
const express = require('express')
const bodyParser = require('body-parser')

let myService = {
  hotelReservationSystem: {
    MyPort: {
      MyFunction: function(args) {
        return {
          name: args.name
        };
      },
      filter: function(args) {
        return {
          hotels: "OK from filter function"
        };
      }
    }
  }
};

let xml = require('fs').readFileSync('services.wsdl', 'utf8');

let app = express();

app.use(bodyParser.raw({type: function(){return true;}, limit: '5mb'}));
app.listen(8001, function(){
  //Note: /wsdl route will be handled by soap module
  //and all other routes & middleware will continue to work
  soap.listen(app, '/wsdl', myService, xml, function(){
    console.log('server initialized');
  });
  app.log = function(type, data) {
    console.log('[' + type + ']' + data)
    // type is 'received' or 'replied'
  };
});