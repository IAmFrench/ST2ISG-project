const soap = require('soap')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const parseString = require('xml2js').parseString;

var url = 'http://localhost:8001/wsdl?wsdl'

function SOAP_filter(args, callback) {
  console.log('[server-rest / filter] starting SOAP Client')
  console.log('[server-rest / filter] query', args)
  soap.createClient(url, (err, client) => {
    client.filter(args, (err, result) => {
      console.log('[server-rest / filter] SOAP response received:', result)
      callback(result)
    })
  })
}

function SOAP_book(args, callback) {
  console.log('[server-rest / book] starting SOAP Client')
  console.log('[server-rest / book] query', args)
  soap.createClient(url, (err, client) => {
    client.book(args, (err, result) => {
      console.log('[server-rest / book] SOAP response received:', result)
      callback(result)
    })
  })
}


const app = express()
app.use(cors())

const port = 3000

app.get('/filter', (req, res) => {
  SOAP_filter(req.query, (response) => {
    res.send(response)
  })  
})

app.get('/book', (req, res) => {
  SOAP_book(req.query, (response) => {
    res.send(response)
  })  
})

app.listen(port, () => {
  console.log(`REST Server listening at http://localhost:${port}`)
})