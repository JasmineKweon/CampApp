// Instead of writing all the routes on a single file, 
// We can separate routes in different folder and use Router()
// This file included all the routes related to campgrounds.

const express = require('express');
const router = express.Router();

const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');

router.get('/', catchAsync(async(req, res) => { // If you have await in function, you need to make the function async
    const campgrounds = await Campground.find({}); //Campground.find({}) takes time, therefore need "await"
    res.render('campgrounds/index', { campgrounds });
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.get('/:id', catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id).populate({ // we need this in order to get review.author. we need populated author of populated review
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author'); //id should match with :id, populate is needed to get review data, otherwise, it will pass only review._id
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}))

router.post('/', isLoggedIn, validateCampground, catchAsync(async(req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    //Flash appears only when you want, if you declare flash here, then it will appear on redirected page.
    req.flash('success', 'Successfully made a new campgroud!');
    res.redirect(`/campgrounds/${campground._id}`);
    //Redirect is needed to prevent user to refreshing the page and repeat updating
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground });
    //Flash appears only when you want, if you declare flash here, then it will appear on redirected page.
    req.flash('success', 'Successfully updated the campgroud!');
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    //Flash appears only when you want, if you declare flash here, then it will appear on redirected page.
    req.flash('success', 'Successfully deleted the campgroud!');
    res.redirect('/campgrounds');
}))

module.exports = router;