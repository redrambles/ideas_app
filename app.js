const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');


const app = express();

// Connect to Mongoose
mongoose.connect('mongodb://localhost/ideas-dev', {
    //useMongoClient: true
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');



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

// Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  console.log(req.flash('success_msg'));
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


// Index Route
app.get('/', (req, res) => {
  const title = 'Hiya!';
  res.render('index', {
    title: title
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

// Ideas Archive
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({date: 'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

// Add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea: idea
    });
  });
});

// Process Form
app.post('/ideas', (req, res) => {
  let errors = [];
  // A little server side error handling, just in case
  if (!req.body.title) {
    errors.push({
      text: 'Please add a title'
    });
  }
  if (!req.body.details) {
    errors.push({
      text: 'Please add some details about your idea. :)'
    });
  }
  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Learning idea added');
        res.redirect('/ideas');
    })
  }

  console.log(req.body);
  // res.send('ok');
});

// Edit form process
app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    // new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
    .then(idea => {
      res.redirect('/ideas');
    });
  });
});

// Delete Idea

app.delete('/ideas/:id', (req, res) => {
  Idea.remove({ _id: req.params.id })
    .then(() => {
      req.flash('success_msg', 'Learning idea removed');
      res.redirect('/ideas');
    });
});


const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});