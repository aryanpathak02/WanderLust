if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const listingRoute = require("./router/listing.js");
const reviewRoute = require("./router/review.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const User = require("./models/user.js");
const LocalStrategy = require("passport-local");
const userRoute = require("./router/user.js");

const dbUrl = `mongodb://127.0.0.1:27017/WonderLust` ;

main()
    .then(() => console.log(`Connected successfully`))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send("Hello, I am Root");
});

app.use(session({
    secret:  process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    },
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);

app.get("*", (req, res) => {
    res.render("pagenotfound");
});

app.use((err, req, res, next) => {
    const { status = 500, message = `Something Wrong Happened` } = err;
    res.status(status).render("error", { message });
});

app.listen(port, () => {
    console.log(`The app is listening at port ${port}`);
});
