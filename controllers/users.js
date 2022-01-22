const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async(req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => { //passport does all the login, we don't need more codes. 
            if (err) return next(err); //this line is needed because that's how passport works
            req.flash('success', 'Welcome to YelpCamp')
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back');
    //redurect to where user was on, if there's no saved url in session.returnTo, then redirect to /campgrounds
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo; //need to delete after assign redirectUrl
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout(); //passport does all the logout, we don't need more codes for logout.
    req.flash('success', "GoodBye!");
    res.redirect('/campgrounds');
}