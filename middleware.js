module.exports.isLoggedin = (req, res, next) => {
  // console.log(req.originalUrl);
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in");
    return res.redirect("/login");
  }
  next();
};
