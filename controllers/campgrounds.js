const Campground = require('../models/campground');

module.exports.index = async(req, res) => { // If you have await in function, you need to make the function async
    const campgrounds = await Campground.find({}); //Campground.find({}) takes time, therefore need "await"
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.showCampground = async(req, res) => {
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
}

module.exports.createCampground = async(req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    //Flash appears only when you want, if you declare flash here, then it will appear on redirected page.
    req.flash('success', 'Successfully made a new campgroud!');
    res.redirect(`/campgrounds/${campground._id}`);
    //Redirect is needed to prevent user to refreshing the page and repeat updating
}

module.exports.renderEditForm = async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground });
    //Flash appears only when you want, if you declare flash here, then it will appear on redirected page.
    req.flash('success', 'Successfully updated the campgroud!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    //Flash appears only when you want, if you declare flash here, then it will appear on redirected page.
    req.flash('success', 'Successfully deleted the campgroud!');
    res.redirect('/campgrounds');
}