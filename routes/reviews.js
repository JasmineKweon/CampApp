// Instead of writing all the routes on a single file, 
// We can separate routes in different folder and use Router()
// This file included all the routes related to reviews.

const express = require('express');
//We need mergeParams: true because we need to get :id from app.js
//In this file, path is not including :id, it's included in app.js
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;