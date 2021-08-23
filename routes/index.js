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

// View all Employees only for Employers
router.get('/viewEmployees',ensureAuthenticated, viewemployeesAuth(["employer"]), async function(req, res, next) {
  const data =  await User.find({role: "employee"}).catch((err) => console.error(err));
  res.render('viewEmployees',{user:req.user, data:data});
});


// Edit Email
router.put('/edit',ensureAuthenticated, async function(req, res, next) {
  const {name} = req.body;
  console.log("name",name);
  await User.updateOne({_id: req.user._id}, {$set: {name: name }}).catch(err=> console.error(err));

  res.redirect('dashboard');
});


// Delete Account
router.get('/delete' ,ensureAuthenticated, async function(req, res, next) {
  await User.findByIdAndRemove(req.user._id).catch((err) =>
  console.error(err));
  req.logout();
  req.flash("success_msg", "You successfully deleted your account");
  res.redirect("/users/register");
});




module.exports = router;
