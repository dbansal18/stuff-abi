var express = require('express');
var router = express.Router();
var passport = require('passport');
var passportSetup = require('./../config/passport');



// Define routes.
router.get('/login',
  function(req, res){
  	if(!req.user){
    	res.render('login');
  	} else {
  		res.redirect('/adminLogin/profile');
  	}
  });
  
router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/adminLogin/login' }),
  function(req, res) {
    res.redirect('/adminLogin/profile');
  });
  
router.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

router.get('/profile',
  // require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
  	if(!req.user){
  		res.redirect('/adminLogin/login');
  	}
    res.render('profile', { user: req.user });
  });

module.exports = router;