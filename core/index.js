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

const numberSchema = new mongoose.Schema({
  name: String,
  number: Number
})

const PhoneNumber = mongoose.model('Number', numberSchema)

if(process.argv.length < 3){
  console.log('USE: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const url =
        `mongodb+srv://admin:${password}@fullstackopen.r1fwxdb.mongodb.net/?retryWrites=true&w=majority&appName=fullstackopen`

mongoose.set('strictQuery', false)

mongoose.connect(url)

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const existPerson = (name) => {
  for(let i = 0 ; i < persons.length ; i++){
    if(persons[i].name == name){
      return true
    }
  }
  return false
}

app.get('/api/persons', (request, response) => {
    PhoneNumber
      .find({})
      .then(phones => {
        response.json(phones)
      })
})

app.get('/info', (request, response) => {
    const now = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${now.toString()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  let person = {id: -1}
  for(let i = 0 ; i < persons.length && person.id == -1; i++){
    if(persons[i].id == id){
      person = persons[i]
    }
  }
  person.id == -1 ? response.sendStatus(404) : response.send(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  PhoneNumber
    .deleteOne({_id: id})
    .then(res => {
      response.sendStatus(200)
    })
})

app.post('/api/persons', (request, response) => {
  if(request.body.name == '' || request.body.number == '' || existPerson(request.body.name)){
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
  }
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})