const express = require('express')
const app = express()
const port = 8080
const envId = process.env.CLOUDENV_ENVIRONMENT_ID
console.log(envId)
app.use(express.static('./client-rest/public'))
app.listen(port, () =>
  console.log(`REST Client listening on port ${port}!`),
)