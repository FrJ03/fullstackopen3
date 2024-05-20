const mongoose = require('mongoose')

const numberSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: Number
})

const PhoneNumber = mongoose.model('Number', numberSchema)

module.exports = { PhoneNumber }