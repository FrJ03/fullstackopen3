import { useState, useEffect } from 'react'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'
import personService from './services/persons'
import Notification from './Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [personsFiltered, setPersonsFiltered] = useState([]) 
  useEffect(()=>{
    personService
      .getAll()
      .then(persons => {
        setPersons(persons)
        setPersonsFiltered(persons)
      })
  }, [])

  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({message: null, type: ''})

  const personExists = (name, personsList) => {
    let ret = false
    for(let i = 0 ; i < personsList.length && ret === false; i++){
      if(personsList[i].name === name){
        ret = true
      }
    }
    return ret
  }

  const personFind = (name, personsList) => {
    for(let i = 0 ; i < personsList.length; i++){
      if(personsList[i].name === name){
        return i
      }
    }
    return -1
  }

  const filterPerson = (filterStr) => {
    if(filterStr === ''){
      setPersonsFiltered(persons)
    }
    else{
      setPersonsFiltered(persons.filter((person) => person.name.toLowerCase().includes(filterStr.toLowerCase())))
    }
  }

  const handlerFilter = (event) => {
    const newFilter = event.target.value
    setFilter(newFilter)
    filterPerson(newFilter)
  }

  const handlerNameChange = (event) => 
    setNewName(event.target.value)
  
  const handlerNumberChange = (event) => 
    setNewNumber(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()
    const name = newName
    if(personExists(name, persons) === false){
      const newPerson = {
        name: name,
        number: newNumber,
        id: `${parseInt(persons[persons.length - 1].id) + 1}`
      }
      personService.create(newPerson)
      const newPersons = persons.concat(newPerson)
      setPersons(newPersons)
      setFilter('')
      setPersonsFiltered(newPersons)
      setNotification({message: `Added ${newPerson.name}`, type: "success"})
    }
    else{
      if(window.confirm(`${name} is already added to phonebook, repalce the old number with a new one?`)){
        
        personService
          .get(name)
          .then(per => {
            const newPerson = {
              name: name,
              number: newNumber,
              id: `${per.id}`
            }
            personService.update(newPerson)

            const pos = personFind(name, persons)
            const posFiltered = personFind(name, personsFiltered)

            const newPersonsList = [...persons]
            newPersonsList[pos].number = newPerson.number
            setPersons(newPersonsList)
            if(posFiltered !== -1){
              const newPersonsFilteredList = [...personsFiltered]
              newPersonsFilteredList[pos].number = newPerson.number
              setPersonsFiltered(newPersonsFilteredList)
            }
            setNotification({message: `Added ${newPerson.name}`, type: "success"})
        })
        .catch(erro => {
          setNotification({message: `Information about ${name} has already been removed from server`, type: "error"})
        })
      }
    }
    setNewName('')
    setNewNumber('')
    setTimeout(()=>{
      setNotification({message: null})
    }, 5000)
  }

  const deleteHandler = (event, person) => {
    event.preventDefault()
    if(window.confirm(`Delete ${person.name} ?`)){
      personService.deletePerson(person)
      const newPersonsList = persons.filter(p => p.name !== person.name)
      const newPersonsFilteredList = personsFiltered.filter(p => p.name !== person.name)
      setPersons(newPersonsList)
      setPersonsFiltered(newPersonsFilteredList)
    }
  }

  const personForm = {
    elements: [
      {
        label: 'name',
        value: newName,
        handler: handlerNameChange
      },
      {
        label: 'number',
        value: newNumber,
        handler: handlerNumberChange
      }
    ],
    submit: {
      text: 'add',
      handler: addPerson
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type}/>
      <Filter filter={filter} handler={handlerFilter}/>
      <h2>add a new</h2>
      <PersonForm form={personForm}/>
      <h2>Numbers</h2>
      <Persons persons={personsFiltered} onClick={deleteHandler}/>
    </div>
  )
}

export default App
