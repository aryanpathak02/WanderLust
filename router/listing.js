const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");
const {isLoggedIn,isOnwer} = require("../middlewares.js");
const ListingController = require("../controller/listings");
const multer  = require('multer');
const {storage} = require("../cloudconfig");
const upload = multer({storage: storage});

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errorMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(403, errorMsg);
    } else {
        next();
    }
}

router.route("/")
.get(wrapAsync(ListingController.showingAllListings))
.post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(ListingController.addNewListing));



// showing new router 
router.get("/new",isLoggedIn, ListingController.renderingFormForListing);
router.get("/my-listings",isLoggedIn,wrapAsync(ListingController.renderingYourListing));

// showing exist listings 
router.get("/:id", wrapAsync(ListingController.showingListing));

router.get("/category/:category",wrapAsync(ListingController.renderCategory));


// edit route 
router.get("/edit/:id",isLoggedIn,isOnwer,wrapAsync(ListingController.renderingEditListing));

router.put("/:id",isLoggedIn,isOnwer,upload.single('listing[image]'),validateListing, wrapAsync(ListingController.editingListing));

router.delete("/:id", isLoggedIn,isOnwer,wrapAsync(ListingController.deleteingListing));



module.exports = router;

