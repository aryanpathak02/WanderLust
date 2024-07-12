const { model } = require("mongoose");
const User = require("../models/user.js");
const {cloudinary} = require('../cloudconfig'); 


module.exports.renderSignUp = (req, res) => {
    res.render("./user/signup");
}

module.exports.saveingNewUser = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({
            username: username,
            email: email
        });

        let registerUser = await User.register(newUser, password);

        req.login(registerUser, (err) => {
            if (err) {
                throw err;
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("./listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};


module.exports.renderingSignIn = (req, res) => {
    res.render("./user/signin");
}

module.exports.signInUser = (req, res) => {

    req.flash('success', 'Welcome to Wonderlust, you have successfully logged in');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
};


module.exports.logoutUser = (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next(error);
        }
        req.flash("success", "You are logged out successfully");
        res.redirect("/listings");
    });
};

module.exports.renderProfilePage = async (req, res) => {
    let data = res.locals.currUser;
    res.render("./user/profilepage.ejs", { data });
}


module.exports.userDetailUpdate = async (req, res) => {
    let { id } = req.params;
    let user = await User.findById(id);
    if (req.body.email) {
        user.email = req.body.email;
    }
    if (req.file) {
      await cloudinary.uploader.destroy(user.image.filename);
        let { path, filename } = req.file;
        user.image = { path, filename };
    }
    await user.save();
    req.flash("success", "your profile has been update successfully.");
    res.redirect("/profile");

}

module.exports.renderusernameform = (req,res)=>{
    res.render("./user/usernameform");
  }

module.exports.checkingUsername = async (req, res) => {
    let { username } = req.body;
    let user = await User.findOne({ username: username });
    // console.log(user);
    if (!user) {
        req.flash("error", "No user found with this username");
        return res.redirect("/usernameform");
    }
  
    req.session.userId = user._id;
    res.render("./user/newpassword", { user }); 
  }  

module.exports.saveNewPassword = async (req, res) => {
    const userId = req.session.userId; 
    // console.log("User ID from session:", userId);
    try {
      let user = await User.findById(userId);
  
      if (!user) {
          req.flash("error", "User not found");
          return res.redirect("/usernameform");
      }
  
       let {password,password1 } = req.body;
      if(password === password1){
        user.setPassword(password, async () => {
          await user.save();
          req.flash('success', 'Password updated successfully');
          res.redirect('/signin');
      });
      }else{
        req.flash('error', 'Passwords do not match');
        res.redirect('/usernameform');
      }
     
  } catch (error) {
      console.error('Error updating password:', error);
      req.flash('error', 'Failed to update password');
      res.redirect('/usernameform');
  }
  }  