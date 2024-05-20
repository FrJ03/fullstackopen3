require('dotenv').config()
const {errorHandler} = require('./errors/errorHandler')
const { PhoneNumber } = require('./models/phoneNumber')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()

morgan.token('data', req => 
  (req.method == 'POST') ? 
    JSON.stringify(req.body)
    :
    ''
)

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(express.static('dist'))

const url = process.env.MONGODB_URL

mongoose.set('strictQuery', false)

mongoose.connect(url)

app.get('/api/persons', (request, response, next) => {
    PhoneNumber
      .find({})
      .then(phones => {
        response.json(phones)
      })
      .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    const now = new Date()
    PhoneNumber
      .find({})
      .then(phones => {
        response.send(`<p>Phonebook has info for ${phones.length} people</p><p>${now.toString()}</p>`)
      })
      .catch(error => next(error))
    
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  PhoneNumber
    .findOne({_id: id})
    .then(phone => {
      response.json(phone)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  PhoneNumber
    .deleteOne({_id: id})
    .then(res => {
      response.sendStatus(200)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  if(request.body.name == '' || request.body.number == ''){
    response.send({ error: 'name must be unique' })
  }
  else{
    const person = new PhoneNumber({
      name: request.body.name,
      number: request.body.number
    })

    person
      .save()
      .then(res => {
        response.sendStatus(200)
      })
      .catch(error => next(error))
  }
})
app.put('/api/persons/:id', (request, response, next) => {
  PhoneNumber
    .updateOne({_id: request.params.id}, {number: request.body.number}, { runValidators: true})
    .then(res => response.sendStatus(200))
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})