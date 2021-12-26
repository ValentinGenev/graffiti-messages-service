import express from 'express'

const server = express()

server.get('/', (request, response) => {
    response.send('Hello world!')
})

server.listen(5000, () => console.log('Server listening on: localhost:5000'))