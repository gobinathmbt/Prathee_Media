const mongoose = require("mongoose");



const employeeSchema = mongoose.Schema({
  uid: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  is_active: { type: Boolean, default: true, },
  is_deleted: { type: Boolean, default: false, },
  created_by: { type: String, default: null, },
  updated_by: { type: String, default: null, },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
});

employeeSchema.pre('save', function (next) {
  now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});




const userSchema = mongoose.Schema({
  uid: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now }
});

userSchema.pre('save', function(next) {
  const now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});


module.exports = {
  User: mongoose.model("users", userSchema),
  Employee: mongoose.model("employee", employeeSchema),
};
