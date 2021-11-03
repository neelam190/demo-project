const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const flash = require('connect-flash');
const { isLoggedIn } = require('./middleware');
const http = require('http');
const server = http.createServer(app);

// mongoose connection
mongoose.connect('mongodb://localhost:27017/demo-project',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false

    }).then(() => console.log("DB Connected"))
    .catch(() => console.log(err));


// assign engine as ejs
app.set('view engine', 'ejs');
// access views folder to display templates in view folder
app.set('views', path.join(__dirname, '/views'));
// middleware to access all the static files in public folder - css, js
app.use(express.static(path.join(__dirname, '/public')));
// middleware for passing form data in login/signup
app.use(express.urlencoded({ extended: true }));
// data coming from axios - frontend
app.use(express.json());

// import routes
const authRoutes = require('./routes/auth');

// set sessions 
app.use(session({
    secret: 'weneedasomebettersecret',
    resave: false,
    saveUninitialized: true,
}));

// import connect-flash
app.use(flash());

// initialize passport - this will run for each incoming request
app.use(passport.initialize());
app.use(passport.session());

// strategy we'll use; serialize/deserialize
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// access flash messages
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

app.get('/', (req, res) => {
    // console.log(req.body);
    res.render('layouts/main-layout');
});

// using routes
app.use(authRoutes);

server.listen(process.env.PORT||3000, () => {
    console.log("Server running at port 3000");
});
