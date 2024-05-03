const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))

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
    response.json(persons)
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
  let deleted = false
  persons = persons.filter((person => {
    if(person.id == id){
      deleted = true
      return false
    }
    else{
      return true
    }
  }))

  response.sendStatus(deleted ? 200 : 404)
})

app.post('/api/persons', (request, response) => {
  if(request.body.name == '' || request.body.number == '' || existPerson(request.body.name)){
    response.send({ error: 'name must be unique' })
  }
  else{
    const person = {
      id: `${Math.floor(Math.random() * 1000000000000)}`,
      name: request.body.name,
      number: request.body.number
    }
    persons.push(person)

    response.sendStatus(200)
  }
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})