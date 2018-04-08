const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');


// Load User Model
// require('../models/User');
// const User = mongoose.model('users');


// User Login Route
router.get('/login', (req, res) =>{
  res.render('users/login');
  //res.send('login');
});

// User Login Route
router.get('/register', (req, res) =>{
  res.render('users/register');
});

// Register form POST
router.post('/register', (req, res) => {
  let errors = [];
  if (req.body.password != req.body.password2){
    errors.push({
      text: "Passwords do not match."
    });
  }

  if (req.body.password.length < 4) {
    errors.push({
      text: "Password must be at least 4 characters"
    });
  }

  if(errors.length > 0){
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };
    console.log(newUser);
    res.send('passed');
  }

});

module.exports = router;