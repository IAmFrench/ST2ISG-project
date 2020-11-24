const soap = require('soap')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const port = 3000
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


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


app.get('/filter', (req, res) => {
  SOAP_filter(req.query, (response) => {
    res.send(response)
  })
})
app.post('/book', (req, res) => {
  SOAP_book(req.body, (response) => {
    res.send(response)
  })  
})


app.listen(port, () => {
  console.log(`REST Server listening at http://localhost:${port}`)
})
