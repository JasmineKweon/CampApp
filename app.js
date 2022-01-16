//Express Routing
//Need to npm i express on terminal to use
const express = require('express');
const app = express();

//mongoose Connect
//Need to npm i mongoose on terminal to use
const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/camp-app');
}

//Define view engine and views
//Need to npm i ejs on terminal to use
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
/* views: 
A directory or an array of directories for the application's views. 
If an array, the views are looked up in the order they occur in the array.*/
/* __dirname:
__dirname is an environment variable that tells you the absolute path of the directory containing the currently executing file.
path.join(__dirname, 'views') returns the current running directory/views*/

//In order to receive urlencoded as req.body
app.use(express.urlencoded({ extended: true }));

//In order to use GET/POST method as PUT/DELETE,etc methods
//Need to npm i method-override on terminal to use
const methodOverride = require('method-override');
//_method should match with _method on ejs file, doesn't have to be _method
app.use(methodOverride('_method'));

//ejsMate is Express (layout, partial, block) template functions for the EJS template engine
const ejsMate = require('ejs-mate')
    //Declare we want to use ejsMate instead of default one. 
app.engine('ejs', ejsMate)

//For server-side validation
const Joi = require('joi');

//Require all the necessary modules
const Campground = require('./models/campground');
const Review = require('./models/review')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
const { campgroundSchema, reviewSchema } = require('./schemas.js');

//middleware for validation
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        //error message is in array, therefore join each index by , and pass String as a msg
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//API calls
app.get('/', (req, res) => {
    res.render('home'); // move to views/home.ejs
    //res.render('page') -> go to views/page.ejs 
    //res.render('page', {argument1, argument2}) -> go to views/page.ejs as passing arguments
    //res.send('msg') -> displays msg on page
})

app.get('/campgrounds', catchAsync(async(req, res) => { // If you have await in function, you need to make the function async
    const campgrounds = await Campground.find({}); //Campground.find({}) takes time, therefore need "await"
    res.render('campgrounds/index', { campgrounds });
}))

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.get('/campgrounds/:id', catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews'); //id should match with :id, populate is needed to get review data, otherwise, it will pass only review._id
    res.render('campgrounds/show', { campground })
}))

app.post('/campgrounds', validateCampground, catchAsync(async(req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
    //Redirect is needed to prevent user to refreshing the page and repeat updating
}))

app.get('/campgrounds/:id/edit', catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground });
    console.log(campground)
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    console.log("here")
    res.redirect(`/campgrounds/${id}`);
}))

//When page user is searching for does not exist, it comes to here! 
// Here, it sets ExpressError with following info and send it to app.use
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

//Error Handling 
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
    //next(err); If you insert this code, it goes to next error-handling. 
    //In this case, it goes to Expree default error handling
})

//Listening on port 3000
app.listen(3000, () => {
    console.log("Serving on port 3000");
})