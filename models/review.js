//review.js: Create Review Schema

//Require mongoose to use it
const mongoose = require('mongoose');

//Create Schema
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

//Export just created schema, so it can be used in other files
//Campgrounds will be collection name
module.exports = mongoose.model('Review', ReviewSchema);