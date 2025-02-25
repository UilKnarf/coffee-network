const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const regularUserSchema = new mongoose.Schema({
  userName: { type: String, unique: true, required: true },
  email: { type: String, unique: true },
  password: { type: String }
});

const oauthUserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  email: { type: String, required: true, lowercase: true },
  displayName: { type: String, required: true },
  profilePicture: { type: String },
});

regularUserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const userSchema = new mongoose.Schema({
  authMethod: { 
    type: String,
    enum: ["regular", "google"],
    required: true
  },
  regularUser: { type: regularUserSchema },
  oauthUser: { type: oauthUserSchema },
});

module.exports = mongoose.model('User', userSchema);
