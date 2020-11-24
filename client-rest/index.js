const express = require('express')
const app = express()
const port = 8080
const envId = process.env.CLOUDENV_ENVIRONMENT_ID
const runningInCodeSpace = !(typeof envId == 'undefined')
let endpoint = "http://localhost:3000"
if (runningInCodeSpace) {
  endpoint = `https://${envId}-3000.apps.codespaces.githubusercontent.com`
}

app.use(express.static('./client-rest/public'))

app.get('/endpoint', (req, res) => {
  res.send(endpoint) 
})

app.listen(port, () => {
  if (runningInCodeSpace) {
    console.log(`REST Client listening at https://${envId}-${port}.apps.codespaces.githubusercontent.com`)
  } else{
    console.log(`REST Client listening at http://localhost:${port}`)
  }
})