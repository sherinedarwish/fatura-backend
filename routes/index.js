const express = require('express');
const router = express.Router();
const User = require("../models/User");
const { ensureAuthenticated,viewemployeesAuth } = require("../config/auth");


//Home Page
router.get('/',ensureAuthenticated, function(req, res, next) {
  res.render('index');
});

//Home Page
router.get('/dashboard', ensureAuthenticated,function(req, res, next) {
  res.render('dashboard', {user:req.user});
});

router.get('/viewEmployees',ensureAuthenticated, viewemployeesAuth(["employer"]), function(req, res, next) {
  const data =  User.find({role: "employee"}).catch((err) => console.error(err));
  res.render('viewEmployees',{user:req.user, data:data});
});

// Delete Account
router.get('/delete' ,ensureAuthenticated,function(req, res, next) {

  res.render('dashboard', {user:req.user});
});




module.exports = router;
