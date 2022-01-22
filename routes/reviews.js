// Instead of writing all the routes on a single file, 
// We can separate routes in different folder and use Router()
// This file included all the routes related to reviews.

const express = require('express');
//We need mergeParams: true because we need to get :id from app.js
//In this file, path is not including :id, it's included in app.js
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const Review = require('../models/review')
const catchAsync = require('../utils/catchAsync');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');

router.post('/', isLoggedIn, validateReview, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    console.log("here")
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;