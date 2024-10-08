const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const employeeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile:{
      type: String,
      required: true,
    },
    EmpId: {
      type: String,
      required: true,
    },
    salary: {
        type: String,
        required: true,
      },
      Titile: {
        type: String,
        required: true,
      }, 
      email: {
        type: String,
        required: true,
      }, 
      Birthday: {
        type: String,
        required: true,
      }, 
  },
  {
    timestamps: true,
  }
);

const employee= mongoose.model("employee", employeeSchema);

module.exports = employee;
