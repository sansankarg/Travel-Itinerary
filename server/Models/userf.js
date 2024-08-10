const mongoose = require('mongoose')

const userfSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
})

const userfModel = mongoose.model('signupuser', userfSchema)
module.exports = userfModel