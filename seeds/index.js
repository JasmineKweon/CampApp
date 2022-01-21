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
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '61eaa1b1b8c440e4846acd14',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: 'https://images.unsplash.com/photo-1472978346569-9fa7ea7adf4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODQzNTF8fHx8fHx8MTY0MTk5OTA2Mw&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
            price: 10.55,
            description: 'This camp is wonderful'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    console.log("Successfuly seeded data to camp-app DB");
    mongoose.connection.close();
})