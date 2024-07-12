const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl, saveUserdetail } = require("../middlewares");
const userController = require("../controller/users");
const { isLoggedIn } = require("../middlewares");
const multer = require('multer');
const { storage } = require("../cloudconfig");
const upload = multer({ storage: storage });
// const wrapAsync = require("../utils/wrapAsync");




router.route("/signup")
  .get(userController.renderSignUp)
  .post(userController.saveingNewUser);

router.route("/signin")
  .get(userController.renderingSignIn)
  .post(saveRedirectUrl, passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.signInUser);


router.route('/profile')
  .get(isLoggedIn, userController.renderProfilePage);

router.route("/profile/:id")
  .put(isLoggedIn, upload.single('image'), (userController.userDetailUpdate))


router.route("/logout")
  .get(userController.logoutUser);


router.route("/usernameform")
  .get(userController.renderusernameform);

router.route("/checkusername")
  .post(userController.checkingUsername);

router.route("/newpassword")
  .post(userController.saveNewPassword);

module.exports = router;
