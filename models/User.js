const { Schema, model } = require("mongoose");
const {v4: uuidv4} = require("uuid")

const userSchema = new Schema(
  {
    uid: {
      type: String,
      required: true,
    },
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

userSchema.pre("validate", function() {
  this.uid = uuidv4();
})

module.exports = model("User", userSchema);
