//Joi is for server-side validation
const Joi = require('joi');
//This campgroundSchema differs from model, this is shcema for Joi
module.exports.campgroundSchema = Joi.object({
    // We are passing value by campground[title],etc. Therefore, we should send Campground as well
    //Then, you need to put title, etc inside of obejct()
    //format: Joi.type.required()
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required()
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    }).required()
})

//If you need sanitize-html package: 
//https://www.npmjs.com/package/sanitize-html