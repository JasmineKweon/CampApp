//mongoose Connect
const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/camp-app');
}

//require all the necessary modules from other files
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

//Seed data to camp-app DB
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        })
        await camp.save();
    }
}

seedDB().then(() => {
    console.log("Successfuly seeded data to camp-app DB");
    mongoose.connection.close();
})