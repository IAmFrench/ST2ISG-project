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

      // parseString(result.arg1.body, function (err, result) {
      //   console.dir(result)
      // })
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