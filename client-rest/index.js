const express = require('express')
const app = express()
const port = 8080
const envId = process.env.CLOUDENV_ENVIRONMENT_ID
const endpoint = `https://${envId}-3000.apps.codespaces.githubusercontent.com`
console.log(envId)
app.use(express.static('./client-rest/public'))

app.get('/endpoint', (req, res) => {
  res.send(endpoint)  
})

app.listen(port, () =>
  console.log(`REST Client listening on port ${port}!`),
)