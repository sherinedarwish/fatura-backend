var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { forwardAuthenticated } = require('../config/auth');
const User = require("../models/User");

// Home Page
router.get('/', function(req, res, next) {
  res.render('index');
});

// Registration Page
router.get('/register',forwardAuthenticated, function(req, res, next) {
  res.render('register');
});

// Login Page
router.get('/login',forwardAuthenticated, function(req, res, next) {
  res.render('login');
});

// Post Register
router.post("/register", (req, res) => {
  const { name, email, password, password2, role} = req.body;

  const errors = [];

  if (!name || !email || !password || !password2) {
      errors.push({ msg: "Please enter all fields" });
  }

  if (password !== password2) {
      errors.push({ msg: "Passwords do not match" });
  }
  // Check password length
  if( password.length < 6)
  {
      errors.push ({ msg:"Password is too short"});
  }
  if (errors.length > 0 )
  {
      res.render('register',{ 
          errors,
          name,
          email,
          password,
          password2,
          role
      });
      console.log(errors);
  }
  else
  {
     
      // Validation Pass
      User.findOne({ email:email })
      .then(user => {
          if(user)
          {
              // USER EXISTS
              errors.push({ msg: "Email is already registered"});
              res.render('register',{ 
                  errors,
                  name,
                  email,
                  password,
                  password2,
                  role
              });
          }
          else
          {
              const newUser = new User({
                  name,
                  email,
                  role,
                  password
                  
              });

              // Hash Password
              bcrypt.genSalt(10,(err,salt) =>
                  bcrypt.hash(newUser.password , salt , (err, hash) => {
                      
                      if(err) throw err;
                      // set passwrd to hashed
                      newUser.password = hash;

                      // save user
                      newUser
                          .save()
                          .then(user => {
                              res.redirect('/users/login')})
                          .catch(err => console.log(err))
              }))
              
          }
      });
  }
});

// Post Login
router.post('/login',(req,res,next)=> {
  passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
  })(req, res, next);

});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});
module.exports = router;
