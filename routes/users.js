var express = require('express');
var router = express.Router();
var passport = require('passport');
var loaclStrategy = require('passport-local').Strategy;

var User = require('../models/user');

//Register page
router.get('/register', function(req, res) {
  res.render('register');
});

//login
router.get('/login', function(req, res) {
  res.render('login');
});

//Register page
router.post('/register', function(req, res) {
  var name = req.body.name,
      email = req.body.email,
      username = req.body.username,
      password = req.body.password,
      password2 = req.body.password2;

  //VAlidation
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'username is required').notEmpty();
  req.checkBody('password', 'password is required').notEmpty();
  req.checkBody('password2', 'Email is password2').equals(req.body.password);

  var errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors: errors
    });
  } else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });

    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });
    req.flash('success_msg', 'You are registered and can now login');
    res.redirect('/users/login');
  }
});

passport.use(new loaclStrategy(function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: "Unknown User"});
      }
      User.comparePassword(password, user.password, function(err, isMatch){
      if(err) throw err;
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message: 'Invaild password'});
      }
    });
 });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login', failureFlash:true}),
  function(req, res) {
    res.redirect('/');
    res.redirect('/users/' + req.user.username);
  });

  router.get('/logout', function(req, res){
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/users/login');
  });

module.exports = router;
