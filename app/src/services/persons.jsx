import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newPerson => {
  const request = axios.post(baseUrl, newPerson)
  return request.then(response => response.data)
}

const deletePerson = person => {
    const personUrl = `${baseUrl}/${person.id}`
    return axios
            .delete(personUrl)
            .then(response => response.data)
}

const update = person => {
    const personUrl = `${baseUrl}/${person.id}`
    return axios
            .put(personUrl, person)
            .then(response => response.data)
}

const get = name => {
  const personUrl = `${baseUrl}?name=${name}`
  const request = axios.get(personUrl)
  return request.then(response => response.data[0])
}

export default { get, getAll, create, deletePerson, update }