module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //store the url they are requesting!
        req.session.returnTo = req.originalUrl; // You can store anything in session. You can name returnTo in other name
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}