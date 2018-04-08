const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user model
const User = mongoose.model('users');


module.exports = function(passport){
  passport.use(new LocalStrategy({
    usernameField: 'email' // this is how a user logs in - with email not username
  }, (email, password, done) => {
    // console.log(email);
    // console.log(password);
    User.findOne({
      email: email // is there a user with that email?
    }).then(user => {
      if(!user){
        return done(null, false, {message: 'No User Found'}); // If there is no user with that email- first parameter is error, second is user (there is none) and there is message
      } 

      // Match password. The database one is hashed - but the one from the form is not - so we need to use bcrypt to compare them
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'Password Incorrect'});
        }
      });
    });
  }));
  
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

};