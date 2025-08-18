const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
    // hash password is do greater than 12, so better just remove the maxlength
    // maxlength: 12,
  },
});
// whenever a new user is about tot be saved, we tell it to do the extra step before using .pre
// this good to keep controllers clean
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// define functions that belong to each document (like methods in a class)
// createJWT is not a reserved name
UserSchema.methods.createJWT = function () {
  return jwt({ userId: this._id, name: this.name }, "jwtSecret", {
    expiresIn: "30d",
  });
};

module.exports = mongoose.model("User", UserSchema);
