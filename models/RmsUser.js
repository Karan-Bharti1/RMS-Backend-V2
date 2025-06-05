const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: String,
  role: {
    type: String,
    enum: ['engineer', 'manager']
  },
  skills: [String],
  seniority: {
    type: String,
    enum: ['junior', 'mid', 'senior']
  },
  maxCapacity: Number,
  department: String
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const RmsUser = mongoose.model('RmsUser', userSchema);
module.exports = RmsUser;
