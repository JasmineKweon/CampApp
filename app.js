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

//Require all the necessary modules
const ExpressError = require('./utils/ExpressError')

//Require all the necessary routes
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

//Declare that all the campgrounds routes to start with /campgrounds
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

//API calls
app.get('/', (req, res) => {
    res.render('home'); // move to views/home.ejs
    //res.render('page') -> go to views/page.ejs 
    //res.render('page', {argument1, argument2}) -> go to views/page.ejs as passing arguments
    //res.send('msg') -> displays msg on page
})

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