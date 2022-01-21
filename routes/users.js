const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async(req, res) => {
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
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back');
    //redurect to where user was on, if there's no saved url in session.returnTo, then redirect to /campgrounds
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo; //need to delete after assign redirectUrl
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout(); //passport does all the logout, we don't need more codes for logout.
    req.flash('success', "GoodBye!");
    res.redirect('/campgrounds');
})

module.exports = router;