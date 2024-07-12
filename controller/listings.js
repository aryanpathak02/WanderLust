const Listings = require("../models/listings");
const {cloudinary} = require('../cloudconfig'); 


async function getLatLong(location) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
  const response = await fetch(url);
  const geocodeData = await response.json();

  if (geocodeData.length > 0) {
    return {
      latitude: parseFloat(geocodeData[0].lat),
      longitude: parseFloat(geocodeData[0].lon),
    };
  } else {
    throw new Error('Location not found');
  }
}

module.exports.showingAllListings = async (req, res) => {
    let listings = await Listings.find();
    res.render("./listings/index.ejs", { listings });
}

module.exports.renderingFormForListing = (req, res) => {
    res.render("./listings/new.ejs");
};


module.exports.addNewListing = async (req, res) => {
  let { path, filename } = req.file;
  let data = req.body.listing;
  let { location } = data;

  try {
    let loc = await getLatLong(location);

    let listing = new Listings({
      ...data,
      owner: req.user._id,
      image: { path, filename },
      maplocation: {
        type: 'Point',
        coordinates: [loc.longitude, loc.latitude]
      }
    });

    let saveListing = await listing.save();
    req.flash("success", "New Listing added successfully");
    return res.redirect("/listings");
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("/listings/new");
  }
}

module.exports.showingListing = async(req, res) => {
    let { id } = req.params;
    let data = await Listings.findById(id)
  .populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  })
  .populate('owner');
    if (!data) {
        req.flash("error", "Listing not found!");
       return res.redirect("/listings");
    }
    res.render("./listings/show", { data });
};

module.exports.renderingEditListing = async (req, res) => {
    let { id } = req.params;
    let data = await Listings.findById(id);
    let originalImage = data.image.path;
    originalImage = originalImage.replace("/upload","/upload/w_250")
    res.render("./listings/edit", { data ,originalImage});
};

module.exports.editingListing = async (req, res) => {
    let { id } = req.params;
    let data = req.body;
    console.log(data);
    let listing = await Listings.findByIdAndUpdate(id, { ...req.body.listing });
    if(req.file){
     await cloudinary.uploader.destroy(listing.image.filename);
     let {path,filename} =req.file;
     listing.image = {path,filename};
     let saveListing =  await listing.save();
    //  console.log(saveListing);
    }
    // console.log(listing);
   req.flash("success", "Listing has been edited successfully");
    res.redirect(`/listings/${id}`);
};


module.exports.deleteingListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listings.findByIdAndDelete(id);
    const oldImagePublicId = deletedListing.image.path;
    await cloudinary.uploader.destroy(oldImagePublicId);
    req.flash("success", "Listing has been deleted successfully");
    res.redirect("/listings");
};


module.exports.renderingYourListing = async (req,res)=>{
  let userId = res.locals.currUser;
  let listings = await Listings.find({ owner: userId }); 
  console.log(listings);
  if(listings.length === 0){
    req.flash("error","No listing found please add one");
    return res.redirect("/listings/new");
  }
  res.render("./listings/index.ejs", { listings });

}


module.exports.renderCategory = async (req,res)=>{
  let {category} = req.params;
  let listings = await Listings.find({category : category});
  res.render("./listings/index.ejs",{listings});
}