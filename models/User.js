const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    generated_password: {
      type: String,
    },
    mobile: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
