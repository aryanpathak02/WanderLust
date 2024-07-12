const Listings = require('../models/listings');
const Review = require('../models/reviews');


module.exports.saveNewReviews = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listings.findById(id)
    let review1 = new Review(req.body.review);
    // console.log(listing);
    review1.author = req.user._id;
    listing.reviews.push(review1);
    let r =  await review1.save();
    await listing.save();
    // console.log(r);
    req.flash("success","New Review added Successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.deletingReview = async (req,res)=>{
    let {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
 };