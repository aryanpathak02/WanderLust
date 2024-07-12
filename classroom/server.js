const express = require("express");
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const path = require("path");

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));



const port = 8080;
app.use(flash());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg  = req.flash("error");
    next();
})

app.get("/", (req, res) => {
    res.send(`Hi , I am root`);
});

app.get("/another", (req, res) => {
    res.send(`Anther page `);
});


app.get("/register", (req, res) => {
    let { name = "nalla" } = req.query;
    req.session.name = name;
    console.log(req.session);
    if(name  === "nalla"){
    req.flash("error", "please eneter proper name ");
    }else{
    req.flash("success", "new user");
    }
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    // console.log(req.flash("success"));
    // const name = req.session.name || "Guest";
    // res.send(`Hello ${name}`);

    res.render("page.ejs",{name :  req.session.name });
});

app.listen(port, () => {
    console.log(`The app is listing at a port ${port}`);
});