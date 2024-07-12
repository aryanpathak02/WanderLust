const Joi = require('joi');


 const listingSchema = Joi.object({
    listing: Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required().min(0),
        country:Joi.string().required(),
        location:Joi.string().required(),
    }).required()
 });


 const reviewSchema = Joi.object({
    review:Joi.object({
        comment:Joi.string().required(),
        rating:Joi.number().min(1).max(5).required(),
        createdAt:Joi.date()
    }).required()
 })

 module.exports = {listingSchema,reviewSchema};