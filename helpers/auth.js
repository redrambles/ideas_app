module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if(req.isAuthenticated()){ // That is a Passport function
      return next(); // keep going
    }
    req.flash('error_msg', 'Not Authorized, boo.');
    res.redirect('/users/login');
  }
};