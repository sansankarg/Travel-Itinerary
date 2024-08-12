const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
    username : String,
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
