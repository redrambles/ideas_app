const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');


// Ideas Archive
router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({user: req.user.id})// only pull up that particular user's stuff
    .sort({date: 'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

// Add Idea Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    if(idea.user != req.user.id){ 
      req.flash('error_msg', 'Not authorized, boo.');
      res.redirect('/ideas');
    } else {
      res.render('ideas/edit', {
        idea: idea
      });
    }
  });
});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
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
      details: req.body.details,
      user: req.user.id
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
router.put('/:id', ensureAuthenticated, (req, res) => {
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

router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.remove({ _id: req.params.id })
    .then(() => {
      req.flash('success_msg', 'Learning idea removed');
      res.redirect('/ideas');
    });
});

module.exports = router;