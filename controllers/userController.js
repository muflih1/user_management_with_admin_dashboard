const User = require("../models/User");
const bcrypt = require("bcrypt");

const userController = {
  newController: async (req, res) => {
    return res.render("users/register");
  },

  loginShowController: (req, res) => {
    const { error, success } = req.query;
    return res.render("users/login", {
      error,
      success,
    });
  },

  createController: async (req, res) => {
    try {
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
      const mobile = req.body.mobile;

      const oldUser = await User.findOne({ email });
      if (oldUser)
        return res.redirect(
          `/users/login?error=${encodeURIComponent(
            "User already exists. Please log in!"
          )}`
        );

      const hash = await bcrypt.hash(password, 10);

      const user = new User({ name, email, password: hash, mobile });
      const savedUser = await user.save();

      if (savedUser) {
        return res.redirect(
          `/users/login?success=${encodeURIComponent("Successfully created.")}`
        );
      }
    } catch (e) {
      res.send(e);
    }
  },

  loginController: async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;

      if (!email)
        return res.render("users/login", {
          error: "Email is required!",
          success: null,
        });

      if (!password)
        return res.render("users/login", {
          error: "Password is required",
          success: null,
        });

      const user = await User.findOne({ email });

      if (!user)
        return res.render("users/login", {
          error: "User not found",
          success: null,
        });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res.render(`users/login`, {
          error: "Email or password is incorrect",
          success: null,
        });

      if (user.isVerified === 0)
        return res.redirect(
          `/users/login?error=${encodeURIComponent(
            "Need verification to login"
          )}`
        );

      req.session.user_id = user._id;

      return res.redirect("/");

      // return res.redirect(
      //   `/users/login?error=${encodeURIComponent(
      //     "Need verification to login!"
      //   )}`
      // );
    } catch (e) {
      res.send(e);
    }
  },

  showUserPage: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.session.user_id });
      if (user.isVerified === 0)
        return res.redirect(
          `/users/login?error=${encodeURIComponent(
            "Need verification to login"
          )}`
        );
      return res.render("users/show", {
        user,
        isAdmin: user.isAdmin,
      });
    } catch (e) {
      console.log(e);
    }
  },

  editController: async (req, res) => {
    const {id} = req.params;
    try {
      const user = await User.findById(id);
      console.log(user);
      res.render('users/edit', { user });
    } catch (e) {
      console.log(e);
    }
  },

  updateController: async (req, res) => {},

  logout: (req, res) => {
    req.session.destroy();
    return res.redirect(
      `/users/login?success=${encodeURIComponent("Loggedout success")}`
    );
  },
};

module.exports = userController;
