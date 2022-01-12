//Express Routing
const express = require('express');
const app = express();

//mongoose Connect
const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/camp-app');
}

//Define view engine and views
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
/* views: 
A directory or an array of directories for the application's views. 
If an array, the views are looked up in the order they occur in the array.*/
/* __dirname:
__dirname is an environment variable that tells you the absolute path of the directory containing the currently executing file.
path.join(__dirname, 'views') returns the current running directory/views*/

//Require all the necessary modules
const Campground = require('./models/campground');

//In order to receive urlencoded as req.body
app.use(express.urlencoded({ extended: true }));


//API calls
app.get('/', (req, res) => {
    res.render('home'); // move to views/home.ejs
    //res.render('page') -> go to views/page.ejs 
    //res.render('page', {argument1, argument2}) -> go to views/page.ejs as passing arguments
    //res.send('msg') -> displays msg on page
})

//
app.get('/campgrounds', async(req, res) => { // If you have await in function, you need to make the function async
    const campgrounds = await Campground.find({}); //Campground.find({}) takes time, therefore need "await"
    res.render('campgrounds/index', { campgrounds });
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.get('/campgrounds/:id', async(req, res) => {
    const campground = await Campground.findById(req.params.id) //id should match with :id
    res.render('campgrounds/show', { campground })
})

app.post('/campgrounds', async(req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

//Listening on port 3000
app.listen(3000, () => {
    console.log("Serving on port 3000");
})