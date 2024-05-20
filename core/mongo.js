const mongoose = require('mongoose')

const numberSchema = new mongoose.Schema({
    name: String,
    number: Number
})

const PhoneNumber = mongoose.model('Number', numberSchema)

if(process.argv.length == 3){
    const password = process.argv[2]
    const url =
        `mongodb+srv://admin:${password}@fullstackopen.r1fwxdb.mongodb.net/?retryWrites=true&w=majority&appName=fullstackopen`

    mongoose.set('strictQuery', false)

    mongoose.connect(url)

    PhoneNumber
        .find({})
        .then(res=>{
            console.log('phonebook:')
            res.forEach(phone => console.log(`${phone.name} ${phone.number}`))
            mongoose.connection.close()
        })

    
}
else if(process.argv.length >= 5){
    const password = process.argv[2]
    const name = process.argv[3]
    const phoneNumber = Number.parseInt(process.argv[4])

    const url =
        `mongodb+srv://admin:${password}@fullstackopen.r1fwxdb.mongodb.net/?retryWrites=true&w=majority&appName=fullstackopen`

    mongoose.set('strictQuery', false)

    mongoose.connect(url)

    const number = new PhoneNumber({
        name: name,
        number: phoneNumber
    })

    number
        .save()
        .then(() => {
            console.log(`added ${name} number ${phoneNumber} to phonebook`)
            mongoose.connection.close()
        })
}
else{
    console.log('INSERT: node mongo.js <password> <name> <number>')
    console.log('SHOW: node mongo.js <password>')
    process.exit(1)
}


