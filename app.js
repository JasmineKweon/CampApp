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


//For Security Prevention 
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize({ // Not allowing $ sign or . sign, etc in request
    replaceWith: '_' //If user insert above signs, then replace it with _
}));



//Helmet: Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
const helmet = require('helmet');
app.use(helmet()); //enables all 11 middleware that comes with helmet 
//If there's any middleware you don't want to use, insert like the following: 
//app.use(helmet({ contentSecurityPolicy: false }));

//helmet.contentSecurityPolicy sets the Content-Security-Policy header 
//which helps mitigate cross-site scripting attacks, among other things.
const scriptSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
    //add if there's more
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
];
const connectSrcUrls = [];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



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
//ejsMate is Express (layout, partial, block) template functions for the EJS template engine
const ejsMate = require('ejs-mate')
    //Declare we want to use ejsMate instead of default one. 
app.engine('ejs', ejsMate)



//In order to make public folder as accessible from other files
app.use(express.static(path.join(__dirname, 'public')));



//In order to receive urlencoded as req.body
app.use(express.urlencoded({ extended: true }));



//In order to use GET/POST method as PUT/DELETE,etc methods
//Need to npm i method-override on terminal to use
const methodOverride = require('method-override');
//_method should match with _method on ejs file, doesn't have to be _method
app.use(methodOverride('_method'));



//Require all the necessary modules
const ExpressError = require('./utils/ExpressError')



//Require all the necessary routes
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');



//Require all necessary models
const User = require('./models/user');



//Session for flash and authentication, need to npm
const session = require('express-session');
const sessionConfig = {
    name: 'session', //the original name is "connect.sid", however for security purpose, it's better if name is set in different one because hacker's going to look for "connect.sid"
    secret: 'thisshouldbebettersecret!',
    resave: false,
    saveUninitialized: true,
    //add some setting to cookie that sent back from session
    //expires in whatever miliseconds
    cookie: {
        //httpOnly is for extra security
        //If the HttpOnly flag is included in the HTTP response header, the cookie cannot be accessed through client side script
        //which means the cookies are only accessible by HTTP and not accessible by javascript
        httpOnly: true,
        //secure: true, only accpets "https" not accept "http"
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //expires in a week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))



//Use Passport
const passport = require('passport');
const LocalStrategy = require('passport-local');
//To Initialize passport
app.use(passport.initialize());
//To use persistent login sessions
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//How we store use in session
passport.serializeUser(User.serializeUser());
//How we get user out of session
passport.deserializeUser(User.deserializeUser());



//In order to use flash
const flash = require('connect-flash');
app.use(flash());



//Instead of passing success messages to ejs from every single routes
//We can use middleware to handle it. 
app.use((req, res, next) => {
    //console.log(req.query); this is for mongoSanitize.  
    res.locals.currentUser = req.user;
    res.locals.successMsg = req.flash('success');
    res.locals.errorMsg = req.flash('error');
    next();
})



//Declare that all the campgrounds routes to start with /campgrounds
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);


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