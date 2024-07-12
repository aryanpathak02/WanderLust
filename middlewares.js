const Listings = require("./models/listings");
const Reviews = require("./models/reviews");

const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;  
    }
    next();
}



const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in");
        return res.redirect("/signin");
    }
    next();
}



const isOnwer = async (req,res,next) =>{
    let { id } = req.params;
    let listing = await Listings.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not are owner of the listing");
        return  res.redirect(`/listings/${id}`);
    }
    next();
}

const isAuthor = async (req,res,next) =>{
    let { id,reviewId } = req.params;
    let review = await Reviews.findById(reviewId).populate('author');
    console.log(review);
    if(!review.author.equals(res.locals.currUser)){
        req.flash("error","you are not are owner of the listing");
        return  res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports = { saveRedirectUrl, isLoggedIn ,isOnwer,isAuthor };


// Cannot GET /listings/66894c8686871f77f43c2d4e/reviews/66898a0de57a53f283126e78