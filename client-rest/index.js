const express = require('express')
const app = express()
const port = 8080
app.use(express.static('./client-rest/public'))
app.listen(port, () =>
  console.log(`REST Client listening on port ${port}!`),
)