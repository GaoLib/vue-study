const express = require('express')

const server = express()

server.get('/', (req, res) => {
  res.send('<strong>Hellow World</strong>')
})

server.listen(80, () => {
  console.log('server running')
})