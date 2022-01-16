//campground.js: Create Camp Ground Schema

//Require mongoose to use it
const mongoose = require('mongoose');
const review = require('./review');

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

CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

//Export just created schema, so it can be used in other files
//Campgrounds will be collection name
module.exports = mongoose.model('Campground', CampgroundSchema);