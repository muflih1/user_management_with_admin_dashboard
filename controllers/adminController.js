const User = require("../models/User");
const bcrypt = require("bcrypt");

class RandomString {
  static generate(length) {
    this.result = "";
    this.characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$-&?.><#@$";
    this.charactersLength = this.characters.length;
    for (var i = 0; i < length; i++) {
      this.result += this.characters.charAt(
        Math.floor(Math.random() * this.charactersLength)
      );
    }
    return this.result;
  }
}

const adminController = {
  loginGet: (req, res) => {
    const { error, success } = req.query;
    return res.render("admin/login", {
      error,
      success,
    });
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.render("admin/login", {
          error: "Account note foud",
          success: null,
        });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res.render("admin/login", {
          error: "Email or password incorrect",
          success: null,
        });

      if (user.isAdmin === 1) {
        req.session.admin_session = user._id;
        return res.redirect("/admin/dashboard");
      }

      return res.redirect(
        `/users/login?error=${encodeURIComponent("You are note an admin!")}`
      );
    } catch (e) {
      console.log(e);
    }
  },

  dashboard: async (req, res) => {
    const { q } = req.query;
    if (q) {
      const users = await User.find({ name: { $regex: ".*" + q + ".*" } });
      return res.render("admin/dashboard", { users, q });
    } else {
      const users = await User.find({ isAdmin: 0 });
      return res.render("admin/dashboard", {
        users,
        q: null,
      });
    }
  },

  newUser: async (req, res) => {
    return res.render("admin/user_new", { error: null });
  },

  showUser: async (req, res) => {
    const { id } = req.query;
    try {
      const user = await User.findOne({ uid: id });
      if (user) {
        return res.render("admin/user_show", { user });
      }
      return res.redirect(
        `/admin/dashboard?error=${encodeURIComponent("User note found!")}`
      );
    } catch (e) {
      console.log(e);
    }
  },

  createUser: async (req, res) => {
    const { name, email, mobile, isVerified } = req.body;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    try {
      if (!email)
        return res.render("admin/user_new", { error: "Email is required" });
      if (!emailRegex.test(email))
        return res.render("admin/user_new", {
          error: "Email must be a valid email!",
        });
      const isExists = await User.findOne({ email });
      if (isExists)
        return res.render("admin/user_new", { error: "User already exists" });
      const password = RandomString.generate(20);
      const hash = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        mobile,
        password: hash,
        generated_password: password,
        isVerified,
      });
      await user.save();
      return res.redirect("/admin/dashboard");
    } catch (e) {
      console.log(e);
    }
  },

  editUser: async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ uid: id });
    return res.render("admin/user_edit", { user });
  },

  updateUser: async (req, res) => {
    const { id } = req.params;
    const { name, email, mobile, isVerified } = req.body;
    try {
      const user = await User.findOneAndUpdate(
        { uid: id },
        {
          $set: {
            name,
            email,
            mobile,
            isVerified,
          },
        },
        { new: true }
      );

      if (!user)
        return res.redirect(
          `/admin/dashboard?error=${encodeURIComponent("User note found!")}`
        );

      return res.redirect(
        `/admin/dashboard?message=${encodeURIComponent("Updated success")}`
      );
    } catch (e) {
      console.log(e);
    }
  },

  destroyUser: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findOneAndDelete({ uid: id });
      if (req.session.user_session === user._id) {
        req.session.destroy();
      }
      return res.redirect("/admin/dashboard");
    } catch (e) {
      console.log(e);
    }
  },
};

module.exports = adminController;
