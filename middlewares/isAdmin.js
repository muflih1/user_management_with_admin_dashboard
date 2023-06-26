const User = require("../models/User");

const isAdmin = async (req, res, next) => {
  const user = await User.findOne({ _id: req.session.user_id });
  if (user && user.isAdmin === 1) {
    next();
  } else {
    return res.redirect(
      `/users/login?error=${encodeURIComponent("You did note have access")}`
    );
  }
};

const isLoggedOut = async (req, res, next) => {
  if (!req.session.user_id) return next();
  return res.redirect("/");
};

const isVerified = async (req, res, next) => {
  if (req.session.user_id) {
    const user = await User.findById(req.session.user_id);
    if (user.isVerified) {
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
};

module.exports = { isAdmin, isLoggedOut, isVerified };
