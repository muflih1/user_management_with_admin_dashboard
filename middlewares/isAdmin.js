const User = require("../models/User");

const isAdmin = async (req, res, next) => {
  const user = await User.findOne({ _id: req.session.admin_session });
  if (user && user.isAdmin === 1) {
    next();
  } else {
    return res.redirect(
      `/users/login?error=${encodeURIComponent("You did note have access")}`
    );
  }
};

const isAdminIsLoggedOut = async (req, res, next) => {
  if (!req.session.admin_session) return next();
  return res.redirect("/admin/dashboard");
};

const isLoggedOut = async (req, res, next) => {
  try {
    if (!req.session.user_session) return next();
    const user = await User.findById(req.session.user_session);
    if (!user) return res.redirect('/users/login');
    return res.redirect("/");
  } catch (e) {
    console.log(e);
  }
};

const isVerified = async (req, res, next) => {
  try {
    if (req.session.user_session) {
      const user = await User.findById(req.session.user_session);
      if (!user) return res.redirect('/users/login');
      if (user.isVerified === 1) {
        return next();
      } else {
        return res.redirect(
          `/users/login?error=${encodeURIComponent(
            "Need verification to login!"
          )}`
        );
      }
    } else {
      res.redirect(
        `/users/login?error=${encodeURIComponent("Login to gain access")}`
      );
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = { isAdminIsLoggedOut, isAdmin, isLoggedOut, isVerified };
