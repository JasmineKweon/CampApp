//campground.js: Create Camp Ground Schema

//Require mongoose to use it
const mongoose = require('mongoose');

//Create Schema
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

//Export just created schema, so it can be used in other files
//Campgrounds will be collection name
module.exports = mongoose.model('Campground', CampgroundSchema);