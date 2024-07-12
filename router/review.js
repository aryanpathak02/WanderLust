const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const {reviewSchema} = require("../schema");
const ExpressError = require("../utils/ExpressError");
const {isLoggedIn,isAuthor} = require("../middlewares.js");
const reviewController = require("../controller/reviews");



const validateReviews=(req,res,next)=> {
    let {error} = reviewSchema.validate(req.body);
    console.log(error);
    if(error){
      let errorMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(403,errorMsg);
    }else{
      next();
  }
  }


  // review router start from here 
router.post("/",isLoggedIn,validateReviews,wrapAsync(reviewController.saveNewReviews));  

router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deletingReview));

module.exports = router;