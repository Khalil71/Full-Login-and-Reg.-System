var express = require('express');
var router = express.Router();

//Register
router.get('/', ensureAuth, function(req, res) {
  res.render('index');
});

function ensureAuth(req, res){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash(req.flash('error_msg', 'You are not logged in'));
    res.redirect('/users/login');
  }
}

module.exports = router;
