const mongoose = require('mongoose')

const numberSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate:{
      validator: function(number){
        return /\d{2,3}-\d+/.test(number)
      },
      message: props => `${props.value} in not a valid phone number`
    }
  }
})

const PhoneNumber = mongoose.model('Number', numberSchema)

module.exports = { PhoneNumber }