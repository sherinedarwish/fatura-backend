const ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Please log in to view that resource');
  res.redirect('/users/login');
}
const forwardAuthenticated = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/dashboard');      
}

const viewemployeesAuth = ( Permissions) =>
{
  return (req,res,next) => {
    const role = req.user.role
    if(Permissions.includes(role))
    {
      next()
    }
    else {
      return console.error("You don't have permission to access");
    }
  }
}

module.exports = {
  ensureAuthenticated,
  forwardAuthenticated,
  viewemployeesAuth
};
