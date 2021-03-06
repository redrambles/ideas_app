const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');


const app = express();

// Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');


// Passport Config
require('./config/passport')(passport);
// DB Config
const db = require('./config/database');

// Connect to Mongoose
mongoose.connect( db.mongoURI, {
    //useMongoClient: true
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));


// Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));


// Method Override middleware
app.use(methodOverride('_method'));

// Even though the 'req.name' variable was set here, it can be accessed from anywhere that has acces to the req object
// app.use(function (req, res, next) {
//   //console.log(Date.now());
//   req.name = 'Ann';
//   next();
// });

// Express sessions middleware which we need in order to use flash messages
app.use(session({
  secret: 'flan',
  resave: true,
  saveUninitialized: true
}));


// Flash middleware
app.use(flash());

// Passport middleware (very important to put this after the session middleware)
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


// Index Route
app.get('/', (req, res) => {
  const title = 'Capture Your Ideas!';
  const subtitle = 'Jot down ideas for your next learning projects.';
  res.render('index', {
    title: title,
    subtitle: subtitle
  });
});

// About Route
app.get('/about', (req, res) => {
  const title = 'About me';
  const description = 'Ann is the bomb, yo!';
  res.render('about', {
    title: title,
    description: description
  });
});


// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});