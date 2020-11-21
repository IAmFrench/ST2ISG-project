const soap = require('soap')
const express = require('express')
const bodyParser = require('body-parser')

let myService = {
  MyService: {
    MyPort: {
      MyFunction: function(args) {
        return {
          name: args.name
        };
      },
      
      // This is how to define an asynchronous function with a callback.
      MyAsyncFunction: function(args, callback) {
        // do some work
        callback({
          name: args.name
        });
      },
      
      // This is how to define an asynchronous function with a Promise.
      MyPromiseFunction: function(args) {
        return new Promise((resolve) => {
          // do some work
          resolve({
            name: args.name
          });
        });
      },
      
      // This is how to receive incoming headers
      HeadersAwareFunction: function(args, cb, headers) {
        return {
          name: headers.Token
        };
      },
      
      // You can also inspect the original `req`
      reallyDetailedFunction: function(args, cb, headers, req) {
        console.log('SOAP `reallyDetailedFunction` request from ' + req.connection.remoteAddress);
        return {
          name: headers.Token
        };
      }
    }
  }
};

let xml = require('fs').readFileSync('services.wsdl', 'utf8');

//express server example
let app = express();
//body parser middleware are supported (optional)
app.use(bodyParser.raw({type: function(){return true;}, limit: '5mb'}));
app.listen(8001, function(){
  //Note: /wsdl route will be handled by soap module
  //and all other routes & middleware will continue to work
  soap.listen(app, '/wsdl', myService, xml, function(){
    console.log('server initialized');
  });
});