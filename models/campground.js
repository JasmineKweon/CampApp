//campground.js: Create Camp Ground Schema

//Require mongoose to use it
const mongoose = require('mongoose');

//Create Schema
const Shcema = mongoose.Schema;

const CampgroundSchema = new mongoose.Schema({
    title: String,
    price: String,
    description: String,
    location: String
})

//Export just created schema, so it can be used in other files
//Campgrounds will be collection name
module.exports = mongoose.model('Campground', CampgroundSchema);