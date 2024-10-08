const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "customer", "manager", "qa"], 
      default: "customer", // Set the default role to "customer"
    },
    password: {
      type: String,
      required: true,
    },
    address: {
        type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Password hashing part
userSchema.pre("save", async function (next) {
  // Check if the password is already hashed
  if (!this.isModified("password")) {
    next();
  }

  // Hashing the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check the password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
