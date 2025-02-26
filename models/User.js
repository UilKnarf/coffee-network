const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const regularUserSchema = new mongoose.Schema({
  userName: { type: String, unique: true, required: true },
  email: { type: String, unique: true },
  password: { type: String }
});

regularUserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

regularUserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const oauthUserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  email: { type: String, required: true, lowercase: true },
  displayName: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  authMethod: { 
    type: String,
    enum: ["regular", "google"],
    required: true
  },
  regularUser: { type: regularUserSchema },
  oauthUser: { type: oauthUserSchema }
});

module.exports = mongoose.model('User', userSchema);
