const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
    username : String,
    no : Number,
    date : String,
    day: Number,
    places: [
        {
            time: String,
            place: String
        }
    ]
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
module.exports = Itinerary;
