const soap = require('soap')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

var url = 'http://localhost:8001/wsdl?wsdl'

function SOAP_filter(args, callback) {
  console.log('[filter] starting SOAP Client')
  soap.createClient(url, (err, client) => {
    client.filter(args, (err, result) => {
      console.log('[filter] SOAP response received')
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})