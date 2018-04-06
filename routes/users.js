const express = require('express');
const router = express.Router();
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

module.exports = router;