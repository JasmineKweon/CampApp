const ExpressError = require('./utils/ExpressError')
const { reviewSchema, campgroundSchema } = require('./schemas.js');
const Campground = require('./models/campground');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //store the url they are requesting!
        req.session.returnTo = req.originalUrl; // You can store anything in session. You can name returnTo in other name
        console.log("!!!!!!!!!!!!!This is middleware-isLogged In!!!!!!!!!!!!!!!!!!!!")
        console.log(req.session.returnTo);
        console.log("!!!!!!!!!!!!!This is middleware-isLogged In!!!!!!!!!!!!!!!!!!!!")
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

//middleware for validation
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        //error message is in array, therefore join each index by , and pass String as a msg
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//Middleware to check whether the author is same with currently logged in user
module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campground/${id}`)
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}