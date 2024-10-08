const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const itemSchema = mongoose.Schema(
  {
    Itemname: {
      type: String,
      required: true,
    },
    Discription:{
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    price: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      }, 
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("item", itemSchema);

module.exports = Item;
