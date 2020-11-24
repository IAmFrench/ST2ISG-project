const soap = require('soap')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const envId = process.env.CLOUDENV_ENVIRONMENT_ID
const runningInCodeSpace = !(typeof envId == 'undefined')
let origin = "http://localhost:8080"
if (runningInCodeSpace) {
  origin = `https://${envId}-8080.apps.codespaces.githubusercontent.com`
}
console.log(`Using ${origin} as origin`)
const port = 3000
const app = express()
app.use(cors({
  credentials: true,
  origin: origin,
}))
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

app.get('/', (req, res) => {
  res.send("It works")
})

app.listen(port, () => {
  if (runningInCodeSpace) {
    console.log(`REST Server listening at https://${envId}-${port}.apps.codespaces.githubusercontent.com`)
  } else{
    console.log(`REST Server listening at http://localhost:${port}`)
  }
})
